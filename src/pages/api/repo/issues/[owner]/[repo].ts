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
    let message = 'Erro ao carregar vagas.';
    if (status === 404) message = 'Repositório não encontrado.';
    if (status === 403)
      message =
        'Limite da API do GitHub atingido. Configure GITHUB_TOKEN no .env (veja .env.example).';
    return res.status(status).json({ error: message });
  }
}
