import type { NextApiRequest, NextApiResponse } from 'next';
import { readFileSync } from 'fs';
import { join } from 'path';
import { fetchRepo } from '../../lib/githubApi';

type RepoItem = { link: string };

function getReposFromConfig(): { owner: string; repo: string }[] {
  const path = join(process.cwd(), 'public', 'repos.json');
  const raw = readFileSync(path, 'utf-8');
  const list = JSON.parse(raw) as RepoItem[];
  return list
    .map(item => {
      const parts = item.link
        .replace(/^\/repository\//, '')
        .split('/')
        .filter(Boolean);
      const repo = parts.pop() ?? '';
      const owner = parts.pop() ?? '';
      return { owner, repo };
    })
    .filter(r => r.owner && r.repo);
}

const CACHE_TTL_MS = 10 * 60 * 1000;
let cachedTotal: number | null = null;
let cachedAt = 0;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    if (cachedTotal !== null && Date.now() - cachedAt < CACHE_TTL_MS) {
      res.setHeader(
        'Cache-Control',
        'public, s-maxage=300, stale-while-revalidate=600',
      );
      return res.status(200).json({ total: cachedTotal });
    }

    const repos = getReposFromConfig();
    const counts = await Promise.all(
      repos.map(async ({ owner, repo }) => {
        try {
          const data = (await fetchRepo(owner, repo)) as {
            open_issues_count?: number;
          };
          return Number(data?.open_issues_count ?? 0);
        } catch {
          return 0;
        }
      }),
    );
    const total = counts.reduce((sum, n) => sum + n, 0);

    cachedTotal = total;
    cachedAt = Date.now();

    res.setHeader(
      'Cache-Control',
      'public, s-maxage=300, stale-while-revalidate=600',
    );
    return res.status(200).json({ total });
  } catch {
    return res.status(500).json({ error: 'Erro ao calcular total de vagas.' });
  }
}
