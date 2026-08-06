import type { NextApiRequest, NextApiResponse } from 'next';
import { repos, type RepoItem } from '../../lib/repos';
import { allowMethods, setCacheHeader } from '../../lib/apiHelpers';

export type { RepoItem };

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<RepoItem[]>,
) {
  if (!allowMethods(req, res, ['GET'])) return;

  setCacheHeader(res, 3600, 86400);
  res.status(200).json(repos);
}
