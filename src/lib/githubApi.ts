const GITHUB_API = 'https://api.github.com';

type CacheEntry<T> = { data: T; expires: number };

const cache = new Map<string, CacheEntry<unknown>>();

const REPO_TTL_MS = 10 * 60 * 1000; // 10 min
const ISSUES_TTL_MS = 5 * 60 * 1000; // 5 min

function getCached<T>(key: string): T | null {
  const entry = cache.get(key) as CacheEntry<T> | undefined;
  if (!entry || Date.now() > entry.expires) return null;
  return entry.data;
}

function setCache<T>(key: string, data: T, ttlMs: number): void {
  cache.set(key, { data, expires: Date.now() + ttlMs });
}

function getHeaders(): Record<string, string> {
  const headers: Record<string, string> = {
    Accept: 'application/vnd.github.v3+json',
  };
  const token = process.env.GITHUB_TOKEN;
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  return headers;
}

export async function fetchRepo(owner: string, repo: string): Promise<unknown> {
  const key = `repo:${owner}/${repo}`;
  const cached = getCached<unknown>(key);
  if (cached) return cached;

  const res = await fetch(`${GITHUB_API}/repos/${owner}/${repo}`, {
    headers: getHeaders(),
  });

  if (!res.ok) {
    const err = new Error(`GitHub API: ${res.status}`);
    (err as Error & { status: number }).status = res.status;
    throw err;
  }

  const data = await res.json();
  setCache(key, data, REPO_TTL_MS);
  return data;
}

export async function fetchIssues(
  owner: string,
  repo: string,
  page: number,
  perPage: number,
): Promise<unknown[]> {
  const key = `issues:${owner}/${repo}:${page}:${perPage}`;
  const cached = getCached<unknown[]>(key);
  if (cached) return cached;

  const params = new URLSearchParams({
    page: String(page),
    per_page: String(perPage),
  });

  const res = await fetch(
    `${GITHUB_API}/repos/${owner}/${repo}/issues?${params}`,
    { headers: getHeaders() },
  );

  if (!res.ok) {
    const err = new Error(`GitHub API: ${res.status}`);
    (err as Error & { status: number }).status = res.status;
    throw err;
  }

  const data = await res.json();
  setCache(key, data, ISSUES_TTL_MS);
  return data as unknown[];
}

export async function fetchIssue(
  owner: string,
  repo: string,
  issueNumber: number,
): Promise<unknown> {
  const key = `issue:${owner}/${repo}:${issueNumber}`;
  const cached = getCached<unknown>(key);
  if (cached) return cached;

  const res = await fetch(
    `${GITHUB_API}/repos/${owner}/${repo}/issues/${issueNumber}`,
    { headers: getHeaders() },
  );

  if (!res.ok) {
    const err = new Error(`GitHub API: ${res.status}`);
    (err as Error & { status: number }).status = res.status;
    throw err;
  }

  const data = await res.json();
  setCache(key, data, ISSUES_TTL_MS);
  return data;
}
