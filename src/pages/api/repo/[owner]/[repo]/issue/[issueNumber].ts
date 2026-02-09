import type { NextApiRequest, NextApiResponse } from 'next';
import { fetchIssue } from '../../../../../../lib/githubApi';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { owner, repo, issueNumber } = req.query;
  if (
    typeof owner !== 'string' ||
    typeof repo !== 'string' ||
    typeof issueNumber !== 'string'
  ) {
    return res
      .status(400)
      .json({ error: 'owner, repo and issueNumber required' });
  }

  const num = parseInt(issueNumber, 10);
  if (Number.isNaN(num) || num < 1) {
    return res.status(400).json({ error: 'Invalid issue number' });
  }

  try {
    const data = await fetchIssue(owner, repo, num);
    res.setHeader(
      'Cache-Control',
      'public, s-maxage=120, stale-while-revalidate=300',
    );
    return res.status(200).json(data);
  } catch (err) {
    const status = (err as { status?: number }).status ?? 500;
    const message =
      status === 404 ? 'Vaga não encontrada.' : 'Erro ao carregar vaga.';
    return res.status(status).json({ error: message });
  }
}
