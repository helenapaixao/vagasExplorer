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
    .map((item) => {
      const parts = item.link
        .replace(/^\/repository\//, '')
        .split('/')
        .filter(Boolean);
      const repo = parts.pop() ?? '';
      const owner = parts.pop() ?? '';
      return { owner, repo };
    })
    .filter((r) => r.owner && r.repo);
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
    let total = 0;

    for (let i = 0; i < repos.length; i += 1) {
      const { owner, repo } = repos[i];
      try {
        const data = (await fetchRepo(owner, repo)) as {
          open_issues_count?: number;
        };
        total += Number(data?.open_issues_count ?? 0);
      } catch {
        // ignora repo inacessível
      }
    }

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
