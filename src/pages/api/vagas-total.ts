import type { NextApiRequest, NextApiResponse } from 'next';
import { searchAllRepos } from '../../lib/githubApi';
import { getRepoRefs } from '../../lib/repos';
import { allowMethods, setCacheHeader } from '../../lib/apiHelpers';

const CACHE_TTL_MS = 10 * 60 * 1000;

let cachedTotal: number | null = null;
let cachedAt = 0;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (!allowMethods(req, res, ['GET'])) return;

  setCacheHeader(res, 300, 600);

  if (cachedTotal !== null && Date.now() - cachedAt < CACHE_TTL_MS) {
    res.status(200).json({ total: cachedTotal });
    return;
  }

  try {
    // One search request for the count. Beats summing `open_issues_count`,
    // which GitHub inflates by including pull requests.
    const { totalCount } = await searchAllRepos(getRepoRefs(), {
      page: 1,
      perPage: 1,
    });

    cachedTotal = totalCount;
    cachedAt = Date.now();
    res.status(200).json({ total: totalCount });
  } catch {
    res.status(500).json({ error: 'Erro ao calcular total de vagas.' });
  }
}
