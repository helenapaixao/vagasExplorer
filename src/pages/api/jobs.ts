import type { NextApiRequest, NextApiResponse } from 'next';
import { searchAllRepos } from '../../lib/githubApi';
import { getRepoRefs } from '../../lib/repos';
import { filtersToSearchTerms, parseFilters } from '../../lib/filters';
import { toApiError } from '../../lib/httpError';
import {
  allowMethods,
  clampInt,
  setCacheHeader,
  singleParam,
} from '../../lib/apiHelpers';
import { toJob } from '../../lib/toJob';

/**
 * Global search across every configured repo, straight from the GitHub search
 * API — no database required.
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (!allowMethods(req, res, ['GET'])) return;

  const page = clampInt(req.query.page ?? 1, 1, 100);
  const perPage = clampInt(req.query.per_page ?? 20, 1, 100);
  const query = singleParam(req.query.q) ?? undefined;
  const terms = filtersToSearchTerms(parseFilters(req.query));

  // Lista vazia significa "todo o catálogo"; só o filtro explícito recorta.
  const repoFilter = singleParam(req.query.repo);
  const refs = repoFilter
    ? getRepoRefs().filter(ref => `${ref.owner}/${ref.repo}` === repoFilter)
    : [];

  try {
    const result = await searchAllRepos(refs, { page, perPage, query, terms });

    setCacheHeader(res, 120, 600);
    res.status(200).json({
      jobs: result.issues.map(toJob),
      total: result.totalCount,
      page,
      perPage,
    });
  } catch (err) {
    const { status, message } = toApiError(err, 'Erro ao buscar vagas.');
    res.status(status).json({ error: message });
  }
}
