import type { GitHubIssue, GitHubLabel, GitHubRepo } from '../../types/github';
import { issueNumberOf } from './client';
import type { OpeningsCommunity, OpeningsOpportunity } from './types';

/**
 * Adapta os artefatos do pipeline para o formato do GitHub que as telas já
 * consomem. Manter o contrato evita reescrever as páginas junto com a troca
 * de fonte.
 */

/** Paleta legível nos dois temas, usada para colorir as tags do snapshot. */
const LABEL_COLORS = [
  'c62e65',
  '2a6f97',
  '2e7d5b',
  '8d5524',
  '6a4c93',
  'b23a48',
  '1b6b7a',
  '7a5c1b',
];

const HASH_MODULUS = 2147483647;

function hashString(value: string): number {
  return Array.from(value).reduce(
    (hash, char) => (hash * 31 + char.charCodeAt(0)) % HASH_MODULUS,
    7,
  );
}

/**
 * O snapshot normaliza as tags e descarta as cores originais do GitHub, então
 * derivamos uma cor estável do próprio nome: a mesma tag pinta igual sempre.
 */
function toLabel(name: string): GitHubLabel {
  const hash = hashString(name);
  return {
    id: hash,
    name,
    color: LABEL_COLORS[hash % LABEL_COLORS.length],
  };
}

export function describeCommunity(
  community: OpeningsCommunity,
  openings: number = community.opportunitiesCount,
): string {
  const vagas = openings === 1 ? '1 vaga aberta' : `${openings} vagas abertas`;
  return `${vagas} · ${community.country} · ${community.region}`;
}

export function toGitHubRepo(
  community: OpeningsCommunity,
  openings: number = community.opportunitiesCount,
): GitHubRepo {
  return {
    full_name: community.repository,
    description: describeCommunity(community, openings),
    // O snapshot não publica estrelas; as telas só mostram o número quando > 0.
    stargazers_count: 0,
    open_issues_count: openings,
    owner: {
      login: community.name,
      avatar_url: community.avatarUrl,
    },
  };
}

export function toGitHubIssue(opportunity: OpeningsOpportunity): GitHubIssue {
  const number = issueNumberOf(opportunity);

  return {
    // `GitHubIssue.id` é numérico e serve de chave de lista e de dedupe; o id
    // do snapshot é string, então derivamos um número estável dele.
    id: hashString(opportunity.id),
    number: number ?? 0,
    title: opportunity.title,
    body: opportunity.description || null,
    html_url: opportunity.url,
    created_at: opportunity.createdAt,
    user: {
      login: opportunity.author.handle,
      avatar_url: opportunity.author.avatarUrl,
    },
    labels: opportunity.tags.map(toLabel),
    repository_url: `https://api.github.com/repos/${opportunity.repository}`,
  };
}
