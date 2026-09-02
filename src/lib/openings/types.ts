/**
 * Subconjunto tipado dos artefatos publicados pelo openings-dev/data-pipeline.
 *
 * Só declaramos os campos que o app consome. O snapshot traz mais informação
 * (proveniência, deduplicação, sources), e ignorá-la aqui evita quebrar a cada
 * campo novo publicado upstream.
 */

export interface OpeningsManifest {
  generatedAt: string;
  schemaVersion: number;
  pageSize: number;
  dataHash: string;
  totals: {
    openOpportunities: number;
    pages: number;
    repositories: number;
    communities: number;
    countries: number;
    regions: number;
  };
  files: {
    facets: string;
    pageLookup: string;
    search: string;
    jobIds: string;
    order: string;
    communities: string;
    aliases: string;
    status: string;
    statusHistory: string;
  };
  pages: { page: number; file: string; count: number }[];
}

export interface OpeningsCommunity {
  repository: string;
  repositoryUrl: string;
  name: string;
  avatarUrl: string;
  region: string;
  country: string;
  countryCode: string;
  locale: string;
  scope: string;
  opportunitiesCount: number;
  lastPostedAt: string | null;
}

export interface OpeningsAuthor {
  id: string;
  name: string;
  handle: string;
  avatarUrl: string;
}

export interface OpeningsTaxonomy {
  areas: string[];
  technologies: string[];
  seniority: string[];
  employmentTypes: string[];
  workModels: string[];
}

export interface OpeningsOpportunity {
  id: string;
  /** `owner/repo#issueNumber` da issue pública de origem. */
  sourceId: string;
  title: string;
  description: string;
  excerpt: string;
  repository: string;
  repositoryUrl: string;
  region: string;
  country: string;
  tags: string[];
  author: OpeningsAuthor;
  community: {
    id: string;
    name: string;
    avatarUrl: string;
    repository: string;
    url: string;
  };
  createdAt: string;
  updatedAt: string;
  url: string;
  taxonomy: OpeningsTaxonomy;
}

export interface OpeningsPage {
  generatedAt: string;
  page: number;
  pageSize: number;
  nextPage: number | null;
  ids: string[];
  items: OpeningsOpportunity[];
}

export interface OpeningsCommunitiesArtifact {
  generatedAt: string;
  items: OpeningsCommunity[];
}
