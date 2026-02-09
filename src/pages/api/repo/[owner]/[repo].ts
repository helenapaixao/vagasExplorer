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
    let message = 'Erro ao buscar repositório.';
    if (status === 404) message = 'Repositório não encontrado.';
    if (status === 403)
      message =
        'Limite da API do GitHub atingido. Configure GITHUB_TOKEN no .env (veja .env.example).';
    return res.status(status).json({ error: message });
  }
}
