import { HttpError } from './httpError';
import { normalize } from './filters';
import type { RepoRef } from './repos';
import type { GitHubIssue, GitHubRepo, IssuesPage } from '../types/github';
import {
  findCommunity,
  loadDedupedCatalog,
  loadOpportunitiesByRepository,
  loadOpportunityCounts,
} from './openings/client';
import { toGitHubIssue, toGitHubRepo } from './openings/mappers';
import type { OpeningsOpportunity } from './openings/types';

/**
 * Fonte das vagas: o snapshot público do `openings-dev/data-pipeline`.
 *
 * O módulo mantém o nome e as assinaturas da versão que falava com a GitHub
 * API para que rotas e páginas sigam iguais — só a origem dos dados mudou.
 * O snapshot dispensa token, rate limit e cron: o cache e a deduplicação
 * ficam em `./openings/client`.
 */

/**
 * Texto que a busca varre. A descrição inteira fica de fora de propósito: ela
 * traz o processo seletivo completo e faria termos comuns casarem com quase
 * tudo. Título, tags e taxonomia é o que o candidato de fato filtra.
 */
function searchableTextOf(opportunity: OpeningsOpportunity): string {
  const { taxonomy } = opportunity;

  return normalize(
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

/** Todos os termos precisam casar: refinar a busca estreita, não alarga. */
function matches(opportunity: OpeningsOpportunity, words: string[]): boolean {
  if (words.length === 0) return true;

  const haystack = searchableTextOf(opportunity);
  return words.every(word => haystack.includes(word));
}

function toWords(query?: string, terms: string[] = []): string[] {
  return [query ?? '', ...terms]
    .map(normalize)
    .flatMap(value => value.split(' '))
    .filter(Boolean);
}

export async function fetchRepo(
  owner: string,
  repo: string,
): Promise<GitHubRepo> {
  const repository = `${owner}/${repo}`;
  const community = await findCommunity(repository);

  if (!community) {
    throw new HttpError(404, `Comunidade ${repository} não está no snapshot.`);
  }

  const counts = await loadOpportunityCounts();
  return toGitHubRepo(community, counts.get(repository.toLowerCase()) ?? 0);
}

export interface FetchIssuesOptions {
  page: number;
  perPage: number;
  /** Free-text search. */
  query?: string;
  /** Extra words from the filter chips, ANDed with `query`. */
  terms?: string[];
}

/**
 * Lista as vagas abertas de um repositório, da mais recente para a mais
 * antiga. Diferente da versão via GitHub API, o total é sempre conhecido:
 * o catálogo inteiro está em memória, então filtrar não custa uma requisição.
 */
export async function fetchIssues(
  owner: string,
  repo: string,
  { page, perPage, query, terms = [] }: FetchIssuesOptions,
): Promise<IssuesPage> {
  const opportunities = await loadOpportunitiesByRepository(`${owner}/${repo}`);
  const words = toWords(query, terms);
  const found = opportunities.filter(item => matches(item, words));

  const start = (page - 1) * perPage;
  return {
    issues: found.slice(start, start + perPage).map(toGitHubIssue),
    totalCount: found.length,
  };
}

export interface SearchAllOptions {
  page: number;
  perPage: number;
  query?: string;
  terms?: string[];
}

export interface SearchAllResult extends IssuesPage {
  totalCount: number;
  /** Mantido pelo contrato: o snapshot não descarta repositório algum. */
  droppedRepos: number;
}

/**
 * Busca em todas as comunidades de uma vez, da vaga mais recente para a mais
 * antiga.
 *
 * `refs` vazio significa "todo o catálogo", e é o caso normal: a lista estática
 * de repositórios cobre menos comunidades do que o snapshot publica, então
 * usá-la como recorte padrão esconderia vagas que o app já tem. Preenchida,
 * ela vira filtro — é assim que `/api/jobs?repo=` restringe a um repositório.
 */
export async function searchAllRepos(
  refs: RepoRef[],
  { page, perPage, query, terms = [] }: SearchAllOptions,
): Promise<SearchAllResult> {
  const catalog = await loadDedupedCatalog();
  const words = toWords(query, terms);

  const wanted = new Set(
    refs.map(ref => `${ref.owner}/${ref.repo}`.toLowerCase()),
  );

  const found = catalog.filter(
    item =>
      (wanted.size === 0 || wanted.has(item.repository.toLowerCase())) &&
      matches(item, words),
  );

  const start = (page - 1) * perPage;
  return {
    issues: found.slice(start, start + perPage).map(toGitHubIssue),
    totalCount: found.length,
    droppedRepos: 0,
  };
}

export async function fetchIssue(
  owner: string,
  repo: string,
  issueNumber: number,
): Promise<GitHubIssue> {
  const opportunities = await loadOpportunitiesByRepository(`${owner}/${repo}`);
  const found = opportunities.find(
    item => toGitHubIssue(item).number === issueNumber,
  );

  if (!found) {
    throw new HttpError(
      404,
      `Vaga ${owner}/${repo}#${issueNumber} não existe.`,
    );
  }

  return toGitHubIssue(found);
}
