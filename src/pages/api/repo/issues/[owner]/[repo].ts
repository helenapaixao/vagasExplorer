import type { NextApiRequest, NextApiResponse } from 'next';
import { fetchIssues } from '../../../../../lib/githubApi';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { owner, repo } = req.query;
  if (typeof owner !== 'string' || typeof repo !== 'string') {
    return res.status(400).json({ error: 'owner and repo are required' });
  }

  const page = Math.max(1, Number(req.query.page) || 1);
  const perPage = Math.min(100, Math.max(1, Number(req.query.per_page) || 10));

  try {
    const data = await fetchIssues(owner, repo, page, perPage);
    res.setHeader(
      'Cache-Control',
      'public, s-maxage=120, stale-while-revalidate=300',
    );
    return res.status(200).json(data);
  } catch (err) {
    const status = (err as { status?: number }).status ?? 500;
    const message =
      status === 404
        ? 'Repositório não encontrado.'
        : 'Erro ao carregar vagas.';
    return res.status(status).json({ error: message });
  }
}
