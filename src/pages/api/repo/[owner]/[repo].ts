import type { NextApiRequest, NextApiResponse } from 'next';
import { fetchRepo } from '../../../../lib/githubApi';
import { toApiError } from '../../../../lib/httpError';
import {
  allowMethods,
  setCacheHeader,
  singleParam,
} from '../../../../lib/apiHelpers';

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

  try {
    const data = await fetchRepo(owner, repo);
    setCacheHeader(res, 300, 600);
    res.status(200).json(data);
  } catch (err) {
    const { status, message } = toApiError(
      err,
      'Erro ao buscar repositório.',
      'Repositório não encontrado.',
    );
    res.status(status).json({ error: message });
  }
}
