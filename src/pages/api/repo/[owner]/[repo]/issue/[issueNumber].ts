import type { NextApiRequest, NextApiResponse } from 'next';
import { fetchIssue } from '../../../../../../lib/githubApi';
import { toApiError } from '../../../../../../lib/httpError';
import {
  allowMethods,
  setCacheHeader,
  singleParam,
} from '../../../../../../lib/apiHelpers';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (!allowMethods(req, res, ['GET'])) return;

  const owner = singleParam(req.query.owner);
  const repo = singleParam(req.query.repo);
  const issueNumber = singleParam(req.query.issueNumber);

  if (!owner || !repo || !issueNumber) {
    res.status(400).json({ error: 'owner, repo and issueNumber required' });
    return;
  }

  const num = Number(issueNumber);
  if (!Number.isInteger(num) || num < 1) {
    res.status(400).json({ error: 'Invalid issue number' });
    return;
  }

  try {
    const data = await fetchIssue(owner, repo, num);
    setCacheHeader(res, 120, 300);
    res.status(200).json(data);
  } catch (err) {
    const { status, message } = toApiError(
      err,
      'Erro ao carregar vaga.',
      'Vaga não encontrada.',
    );
    res.status(status).json({ error: message });
  }
}
