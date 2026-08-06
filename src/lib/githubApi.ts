import { HttpError } from './httpError';
import type { RepoRef } from './repos';
import type { GitHubIssue, GitHubRepo, IssuesPage } from '../types/github';

const GITHUB_API = 'https://api.github.com';

const REPO_TTL_MS = 10 * 60 * 1000;
const ISSUES_TTL_MS = 5 * 60 * 1000;

/**
 * In-memory cache, bounded so a long-lived server process can't grow without
 * limit (one entry per repo/page/query combination).
 */
const MAX_CACHE_ENTRIES = 500;

type CacheEntry<T> = { data: T; expires: number };

const cache = new Map<string, CacheEntry<unknown>>();

function getCached<T>(key: string): T | null {
  const entry = cache.get(key) as CacheEntry<T> | undefined;
  if (!entry) return null;

  if (Date.now() > entry.expires) {
    cache.delete(key);
    return null;
  }

  // Refresh insertion order so the LRU eviction below drops cold entries.
  cache.delete(key);
  cache.set(key, entry);
  return entry.data;
}

function setCache<T>(key: string, data: T, ttlMs: number): void {
  cache.set(key, { data, expires: Date.now() + ttlMs });

  while (cache.size > MAX_CACHE_ENTRIES) {
    const oldest = cache.keys().next();
    if (oldest.done) break;
    cache.delete(oldest.value);
  }
}

function getHeaders(): Record<string, string> {
  const headers: Record<string, string> = {
    Accept: 'application/vnd.github.v3+json',
  };

  const token = process.env.GITHUB_TOKEN;
  if (token) headers.Authorization = `Bearer ${token}`;

  return headers;
}

async function githubFetch<T>(path: string): Promise<T> {
  const res = await fetch(`${GITHUB_API}${path}`, { headers: getHeaders() });

  if (!res.ok) {
    // GitHub answers an exhausted rate limit with 403 and a zeroed remaining
    // count; surface it as 429 so callers can tell it apart from a real 403.
    const isRateLimited =
      res.status === 403 && res.headers.get('x-ratelimit-remaining') === '0';

    throw new HttpError(
      isRateLimited ? 429 : res.status,
      `GitHub API: ${res.status}`,
    );
  }

  return (await res.json()) as T;
}

/**
 * The issues endpoint also returns pull requests. Everything downstream treats
 * an issue as a job posting, so PRs are dropped here, once.
 */
function onlyIssues(items: GitHubIssue[]): GitHubIssue[] {
  return items.filter(item => !item.pull_request);
}

async function cached<T>(
  key: string,
  ttlMs: number,
  load: () => Promise<T>,
): Promise<T> {
  const hit = getCached<T>(key);
  if (hit !== null) return hit;

  const data = await load();
  setCache(key, data, ttlMs);
  return data;
}

export function fetchRepo(owner: string, repo: string): Promise<GitHubRepo> {
  return cached(`repo:${owner}/${repo}`, REPO_TTL_MS, () =>
    githubFetch<GitHubRepo>(`/repos/${owner}/${repo}`),
  );
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
 * Lists open issues for a repo, newest first. When a search term or filter is
 * active the GitHub search API is used instead, so the search covers the whole
 * repo rather than the issues that happen to be loaded in the browser.
 */
export function fetchIssues(
  owner: string,
  repo: string,
  { page, perPage, query, terms = [] }: FetchIssuesOptions,
): Promise<IssuesPage> {
  const words = [query?.trim(), ...terms].filter(Boolean) as string[];

  if (words.length > 0) {
    const search = words.join(' ');
    const key = `search:${owner}/${repo}:${page}:${perPage}:${search}`;

    return cached(key, ISSUES_TTL_MS, async () => {
      const params = new URLSearchParams({
        q: `${search} repo:${owner}/${repo} is:issue is:open`,
        sort: 'created',
        order: 'desc',
        page: String(page),
        per_page: String(perPage),
      });

      const data = await githubFetch<{
        total_count: number;
        items: GitHubIssue[];
      }>(`/search/issues?${params}`);

      return {
        issues: onlyIssues(data.items ?? []),
        totalCount: data.total_count ?? null,
      };
    });
  }

  const key = `issues:${owner}/${repo}:${page}:${perPage}`;
  return cached(key, ISSUES_TTL_MS, async () => {
    const params = new URLSearchParams({
      state: 'open',
      sort: 'created',
      direction: 'desc',
      page: String(page),
      per_page: String(perPage),
    });

    const data = await githubFetch<GitHubIssue[]>(
      `/repos/${owner}/${repo}/issues?${params}`,
    );

    return { issues: onlyIssues(data), totalCount: null };
  });
}

/** GitHub rejects search queries longer than this. */
const MAX_SEARCH_QUERY = 256;

/** Upper bound on results paged through when several queries must be merged. */
const MAX_MERGE_WINDOW = 500;

interface SearchResponse {
  total_count: number;
  items: GitHubIssue[];
}

function searchIssues(
  q: string,
  page: number,
  perPage: number,
): Promise<SearchResponse> {
  const params = new URLSearchParams({
    q,
    sort: 'created',
    order: 'desc',
    page: String(page),
    per_page: String(perPage),
  });

  return cached(`q:${q}:${page}:${perPage}`, ISSUES_TTL_MS, () =>
    githubFetch<SearchResponse>(`/search/issues?${params}`),
  );
}

/**
 * Packs `repo:owner/name` qualifiers into as few queries as fit the length
 * limit. Repeated qualifiers of the same type are ORed by GitHub, so the
 * usual case is a single query covering every repo.
 */
function buildRepoQueries(
  refs: RepoRef[],
  base: string,
): { queries: string[]; dropped: number } {
  const qualifiers = refs.map(ref => `repo:${ref.owner}/${ref.repo}`);
  const queries: string[] = [];
  let current = '';
  let dropped = 0;

  qualifiers.forEach(qualifier => {
    // A repo whose qualifier can't fit even alone would silently vanish.
    if (`${base} ${qualifier}`.length > MAX_SEARCH_QUERY) {
      dropped += 1;
      return;
    }

    const candidate = current ? `${current} ${qualifier}` : qualifier;
    if (`${base} ${candidate}`.length > MAX_SEARCH_QUERY) {
      queries.push(current);
      current = qualifier;
    } else {
      current = candidate;
    }
  });

  if (current) queries.push(current);
  return { queries: queries.map(part => `${base} ${part}`), dropped };
}

export interface SearchAllOptions {
  page: number;
  perPage: number;
  query?: string;
  terms?: string[];
}

export interface SearchAllResult extends IssuesPage {
  totalCount: number;
  /** Repos left out because their qualifier didn't fit the query limit. */
  droppedRepos: number;
}

/**
 * Searches open issues across every configured repo in one go, newest first.
 * Uses only the GitHub API — no database involved.
 */
export async function searchAllRepos(
  refs: RepoRef[],
  { page, perPage, query, terms = [] }: SearchAllOptions,
): Promise<SearchAllResult> {
  const base = [query?.trim(), ...terms, 'is:issue', 'is:open']
    .filter(Boolean)
    .join(' ');

  const { queries, dropped } = buildRepoQueries(refs, base);

  if (queries.length === 0) {
    return { issues: [], totalCount: 0, droppedRepos: dropped };
  }

  // The common case: everything fits one query, so GitHub does the paging and
  // the total is exact.
  if (queries.length === 1) {
    const data = await searchIssues(queries[0], page, perPage);
    return {
      issues: onlyIssues(data.items ?? []),
      totalCount: data.total_count ?? 0,
      droppedRepos: dropped,
    };
  }

  // Too many repos for one query: page each query far enough to cover the
  // requested slice, then merge and sort in memory.
  const needed = Math.min(page * perPage, MAX_MERGE_WINDOW);
  const pagesPerQuery = Math.ceil(needed / 100);

  const responses = await Promise.all(
    queries.flatMap(q =>
      Array.from({ length: pagesPerQuery }, (_, index) =>
        searchIssues(q, index + 1, 100).catch(() => null),
      ),
    ),
  );

  const seen = new Set<number>();
  const merged: GitHubIssue[] = [];
  let totalCount = 0;

  responses.forEach((data, index) => {
    if (!data) return;
    // total_count repeats across pages of the same query; count it once.
    if (index % pagesPerQuery === 0) totalCount += data.total_count ?? 0;

    onlyIssues(data.items ?? []).forEach(issue => {
      if (seen.has(issue.id)) return;
      seen.add(issue.id);
      merged.push(issue);
    });
  });

  merged.sort(
    (a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
  );

  const start = (page - 1) * perPage;
  return {
    issues: merged.slice(start, start + perPage),
    totalCount,
    droppedRepos: dropped,
  };
}

export function fetchIssue(
  owner: string,
  repo: string,
  issueNumber: number,
): Promise<GitHubIssue> {
  return cached(`issue:${owner}/${repo}:${issueNumber}`, ISSUES_TTL_MS, () =>
    githubFetch<GitHubIssue>(`/repos/${owner}/${repo}/issues/${issueNumber}`),
  );
}
