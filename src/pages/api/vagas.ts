import type { NextApiRequest, NextApiResponse } from 'next';
import { issueNumberOf, loadDedupedCatalog } from '../../lib/openings/client';
import type { OpeningsOpportunity } from '../../lib/openings/types';

export type VagaItem = {
  id: string;
  title: string;
  excerpt: string;
  repository: string;
  communityName: string;
  avatarUrl: string;
  tags: string[];
  createdAt: string;
  /** Rota interna da vaga; cai no repositório quando falta o número da issue. */
  link: string;
  url: string;
};

export type VagasResponse = {
  total: number;
  page: number;
  perPage: number;
  items: VagaItem[];
};

const DEFAULT_PER_PAGE = 20;
const MAX_PER_PAGE = 50;
const MAX_TAGS = 6;

function parsePositiveInt(value: unknown, fallback: number): number {
  const parsed = Number.parseInt(String(value ?? ''), 10);
  return Number.isNaN(parsed) || parsed < 1 ? fallback : parsed;
}

function normalizeText(value: string): string {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .replace(/[^\p{L}\p{N}]+/gu, ' ')
    .trim();
}

/**
 * Texto indexado da vaga. A descrição inteira fica de fora de propósito: ela
 * traz o processo seletivo completo e faria qualquer termo comum casar com
 * quase tudo. Título, tags e taxonomia é o que o candidato de fato filtra.
 */
function searchableTextOf(opportunity: OpeningsOpportunity): string {
  const { taxonomy } = opportunity;

  return normalizeText(
    [
      opportunity.title,
      opportunity.excerpt,
      opportunity.repository,
      opportunity.community.name,
      opportunity.country,
      ...opportunity.tags,
      ...taxonomy.areas,
      ...taxonomy.technologies,
      ...taxonomy.seniority,
      ...taxonomy.employmentTypes,
      ...taxonomy.workModels,
    ].join(' '),
  );
}

function toVagaItem(opportunity: OpeningsOpportunity): VagaItem {
  const number = issueNumberOf(opportunity);
  const base = `/repository/${opportunity.repository}`;

  return {
    id: opportunity.id,
    title: opportunity.title,
    excerpt: opportunity.excerpt,
    repository: opportunity.repository,
    communityName: opportunity.community.name,
    avatarUrl: opportunity.community.avatarUrl,
    tags: opportunity.tags.slice(0, MAX_TAGS),
    createdAt: opportunity.createdAt,
    link: number === null ? base : `${base}/${number}`,
    url: opportunity.url,
  };
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const query = typeof req.query.q === 'string' ? req.query.q : '';
  const page = parsePositiveInt(req.query.page, 1);
  const perPage = Math.min(
    parsePositiveInt(req.query.per_page, DEFAULT_PER_PAGE),
    MAX_PER_PAGE,
  );

  try {
    const catalog = await loadDedupedCatalog();
    const terms = normalizeText(query).split(' ').filter(Boolean);

    // Todos os termos precisam casar: refinar a busca deve estreitar o
    // resultado, não alargá-lo como faria um OR.
    const matches = terms.length
      ? catalog.filter(opportunity => {
          const haystack = searchableTextOf(opportunity);
          return terms.every(term => haystack.includes(term));
        })
      : catalog;

    const start = (page - 1) * perPage;
    const body: VagasResponse = {
      total: matches.length,
      page,
      perPage,
      items: matches.slice(start, start + perPage).map(toVagaItem),
    };

    res.setHeader(
      'Cache-Control',
      'public, s-maxage=600, stale-while-revalidate=3600',
    );
    return res.status(200).json(body);
  } catch {
    return res.status(502).json({ error: 'Erro ao buscar vagas.' });
  }
}
