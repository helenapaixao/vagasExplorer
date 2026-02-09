import type { NextApiRequest, NextApiResponse } from 'next';
import { fetchRepo } from '../../../../lib/githubApi';

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

  try {
    const data = await fetchRepo(owner, repo);
    res.setHeader(
      'Cache-Control',
      'public, s-maxage=300, stale-while-revalidate=600',
    );
    return res.status(200).json(data);
  } catch (err) {
    const status = (err as { status?: number }).status ?? 500;
    const message =
      status === 404
        ? 'Repositório não encontrado.'
        : 'Erro ao buscar repositório.';
    return res.status(status).json({ error: message });
  }
}
