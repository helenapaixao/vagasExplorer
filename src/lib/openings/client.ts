import type {
  OpeningsCommunitiesArtifact,
  OpeningsCommunity,
  OpeningsManifest,
  OpeningsOpportunity,
  OpeningsPage,
} from './types';

/**
 * Leitor do snapshot público do openings-dev/data-pipeline.
 *
 * O pipeline já varre as comunidades do GitHub e publica JSON estático, então
 * o app não precisa de token do GitHub, cron nem banco. Tudo aqui roda no
 * servidor (API Routes) com cache em memória; as rotas ainda mandam
 * Cache-Control para o CDN absorver a maior parte do tráfego.
 */

const DEFAULT_BASE_URL =
  'https://raw.githubusercontent.com/openings-dev/data-pipeline/main/snapshots/opportunities';

/** Versão de schema em que os tipos deste módulo foram escritos. */
const EXPECTED_SCHEMA_VERSION = 6;

const MANIFEST_TTL_MS = 5 * 60 * 1000;
const COMMUNITIES_TTL_MS = 30 * 60 * 1000;
const CATALOG_TTL_MS = 10 * 60 * 1000;

/** Requisições simultâneas ao raw.githubusercontent ao montar o catálogo. */
const PAGE_FETCH_CONCURRENCY = 6;

export function getOpeningsBaseUrl(): string {
  const configured = process.env.OPENINGS_DATA_BASE_URL?.trim();
  return (configured || DEFAULT_BASE_URL).replace(/\/+$/, '');
}

function openingsUrl(path: string): string {
  return `${getOpeningsBaseUrl()}/${path.replace(/^\/+/, '')}`;
}

type CacheEntry = { value: Promise<unknown>; expiresAt: number };

const cache = new Map<string, CacheEntry>();

/**
 * Cache com TTL que memoriza a promise, não o valor: chamadas concorrentes
 * compartilham o mesmo fetch. Falha remove a entrada para não fixar o erro.
 */
function cached<T>(
  key: string,
  ttlMs: number,
  load: () => Promise<T>,
): Promise<T> {
  const entry = cache.get(key);
  if (entry && Date.now() < entry.expiresAt) {
    return entry.value as Promise<T>;
  }

  const value = load().catch(error => {
    cache.delete(key);
    throw error;
  });

  cache.set(key, { value, expiresAt: Date.now() + ttlMs });
  return value;
}

async function fetchArtifact<T>(path: string): Promise<T> {
  const url = openingsUrl(path);
  const response = await fetch(url, {
    headers: { Accept: 'application/json' },
  });

  if (!response.ok) {
    const error = new Error(
      `Openings data pipeline: ${response.status} em ${path}`,
    );
    (error as Error & { status: number }).status = response.status;
    throw error;
  }

  // O raw.githubusercontent serve os snapshots como text/plain.
  return (await response.json()) as T;
}

export function loadManifest(): Promise<OpeningsManifest> {
  return cached('manifest', MANIFEST_TTL_MS, async () => {
    const manifest = await fetchArtifact<OpeningsManifest>('api/manifest.json');

    if (manifest.schemaVersion !== EXPECTED_SCHEMA_VERSION) {
      // Não é fatal: campos costumam ser adicionados, não removidos. Mas o
      // aviso é o sinal de que estes tipos precisam ser revisados.
      // eslint-disable-next-line no-console
      console.warn(
        `Openings schemaVersion ${manifest.schemaVersion} difere da esperada ${EXPECTED_SCHEMA_VERSION}.`,
      );
    }

    return manifest;
  });
}

export function loadCommunities(): Promise<OpeningsCommunity[]> {
  return cached('communities', COMMUNITIES_TTL_MS, async () => {
    const manifest = await loadManifest();
    const artifact = await fetchArtifact<OpeningsCommunitiesArtifact>(
      manifest.files.communities,
    );
    return artifact.items;
  });
}

export async function findCommunity(
  repository: string,
): Promise<OpeningsCommunity | null> {
  const wanted = repository.toLowerCase();
  const communities = await loadCommunities();
  return (
    communities.find(item => item.repository.toLowerCase() === wanted) ?? null
  );
}

async function mapWithConcurrency<T, R>(
  items: T[],
  limit: number,
  // eslint-disable-next-line no-unused-vars
  map: (item: T) => Promise<R>,
): Promise<R[]> {
  const results = new Array<R>(items.length);
  let cursor = 0;

  /** Cada worker puxa o próximo índice livre até a fila acabar. */
  const runNext = async (): Promise<void> => {
    const index = cursor;
    cursor += 1;
    if (index >= items.length) return;
    results[index] = await map(items[index]);
    await runNext();
  };

  await Promise.all(
    Array.from({ length: Math.min(limit, items.length) }, runNext),
  );

  return results;
}

/**
 * Baixa todas as páginas do snapshot e devolve o catálogo achatado.
 *
 * O pipeline não publica artefato por repositório, então filtrar por
 * comunidade exige o catálogo inteiro (~800 vagas, ~4 MB). A chave do cache
 * inclui o dataHash: manifest novo gera catálogo novo, sem risco de misturar
 * páginas de gerações diferentes.
 */
export function loadCatalog(): Promise<OpeningsOpportunity[]> {
  return loadManifest().then(manifest => {
    const key = `catalog:${manifest.dataHash}`;

    // Manifest novo invalida o catálogo antigo: nunca misturar gerações.
    Array.from(cache.keys())
      .filter(existing => existing.startsWith('catalog:') && existing !== key)
      .forEach(stale => cache.delete(stale));

    return cached(key, CATALOG_TTL_MS, async () => {
      const pages = await mapWithConcurrency(
        manifest.pages,
        PAGE_FETCH_CONCURRENCY,
        entry => fetchArtifact<OpeningsPage>(entry.file),
      );

      return pages.flatMap(page => page.items);
    });
  });
}

function byNewestFirst(a: OpeningsOpportunity, b: OpeningsOpportunity): number {
  return Date.parse(b.createdAt) - Date.parse(a.createdAt);
}

export async function loadOpportunitiesByRepository(
  repository: string,
): Promise<OpeningsOpportunity[]> {
  const wanted = repository.toLowerCase();
  const catalog = await loadCatalog();
  return catalog
    .filter(item => item.repository.toLowerCase() === wanted)
    .sort(byNewestFirst);
}

/** Número da issue original, extraído do `sourceId` (`owner/repo#123`). */
export function issueNumberOf(opportunity: OpeningsOpportunity): number | null {
  const raw = opportunity.sourceId.split('#').pop();
  const parsed = Number.parseInt(raw ?? '', 10);
  return Number.isNaN(parsed) ? null : parsed;
}

export async function findOpportunityByIssue(
  repository: string,
  issueNumber: number,
): Promise<OpeningsOpportunity | null> {
  const opportunities = await loadOpportunitiesByRepository(repository);
  return (
    opportunities.find(item => issueNumberOf(item) === issueNumber) ?? null
  );
}
