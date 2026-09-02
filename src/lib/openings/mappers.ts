import type {
  IssueProps,
  LabelsProps,
  RepositoryProps,
} from '../../utils/repositoryInterfaces';
import { issueNumberOf } from './client';
import type { OpeningsCommunity, OpeningsOpportunity } from './types';

/**
 * Adapta os artefatos do pipeline para os contratos que as telas já consomem.
 * Manter o formato evita reescrever as páginas junto com a troca de fonte.
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
function toLabel(name: string): LabelsProps {
  const hash = hashString(name);
  return {
    id: hash,
    name,
    color: LABEL_COLORS[hash % LABEL_COLORS.length],
  };
}

/**
 * Contagem exibida. O total do snapshot inclui reposts, então quem já apurou o
 * número pós-dedupe passa `openings` para o card bater com a listagem.
 */
export function describeCommunity(
  community: OpeningsCommunity,
  openings: number = community.opportunitiesCount,
): string {
  const vagas = openings === 1 ? '1 vaga aberta' : `${openings} vagas abertas`;
  return `${vagas} · ${community.country} · ${community.region}`;
}

export function toRepositoryProps(
  community: OpeningsCommunity,
  openings: number = community.opportunitiesCount,
): RepositoryProps {
  return {
    full_name: community.repository,
    description: describeCommunity(community, openings),
    open_issues_count: openings,
    owner: {
      login: community.name,
      avatar_url: community.avatarUrl,
    },
  };
}

export function toIssueProps(opportunity: OpeningsOpportunity): IssueProps {
  const number = issueNumberOf(opportunity);

  return {
    id: opportunity.id,
    title: opportunity.title,
    body: opportunity.description || null,
    html_url: opportunity.url,
    user: {
      login: opportunity.author.handle,
      avatar_url: opportunity.author.avatarUrl,
    },
    labels: opportunity.tags.map(toLabel),
    ...(number === null ? {} : { number }),
  };
}
