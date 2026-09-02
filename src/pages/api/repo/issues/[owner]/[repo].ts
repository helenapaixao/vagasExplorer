import type { NextApiRequest, NextApiResponse } from 'next';
import { fetchIssues } from '../../../../../lib/githubApi';
import { toApiError } from '../../../../../lib/httpError';
import { filtersToSearchTerms, parseFilters } from '../../../../../lib/filters';
import {
  allowMethods,
  clampInt,
  setCacheHeader,
  singleParam,
} from '../../../../../lib/apiHelpers';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (!allowMethods(req, res, ['GET'])) return;

  const owner = singleParam(req.query.owner);
  const repo = singleParam(req.query.repo);

  if (!owner || !repo) {
    res.status(400).json({ error: 'owner and repo are required' });
    return;
  }

  const page = clampInt(req.query.page ?? 1, 1, 100);
  const perPage = clampInt(req.query.per_page ?? 10, 1, 100);
  const query = singleParam(req.query.q) ?? undefined;
  const terms = filtersToSearchTerms(parseFilters(req.query));

  try {
    const data = await fetchIssues(owner, repo, {
      page,
      perPage,
      query,
      terms,
    });
    setCacheHeader(res, 120, 300);
    res.status(200).json(data);
  } catch (err) {
    const { status, message } = toApiError(
      err,
      'Erro ao carregar vagas.',
      'Repositório não encontrado.',
    );
    res.status(status).json({ error: message });
  }
}
