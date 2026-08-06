import reposJson from '../data/repos.json';

export interface RepoItem {
  /** App route, e.g. `/repository/backend-br/vagas`. */
  link: string;
  imageUrl: string;
  name: string;
  desc: string;
}

export interface RepoRef {
  owner: string;
  repo: string;
}

export const repos: RepoItem[] = reposJson;

/** `/repository/backend-br/vagas` -> `{ owner: 'backend-br', repo: 'vagas' }` */
export function parseRepoLink(link: string): RepoRef | null {
  const parts = link
    .replace(/^\/repository\//, '')
    .split('/')
    .filter(Boolean);

  const repo = parts.pop();
  const owner = parts.pop();
  if (!owner || !repo) return null;

  return { owner, repo };
}

export function getRepoRefs(): RepoRef[] {
  return repos
    .map(item => parseRepoLink(item.link))
    .filter((ref): ref is RepoRef => ref !== null);
}
