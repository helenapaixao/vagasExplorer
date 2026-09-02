import type { NextApiRequest, NextApiResponse } from 'next';
import { findCommunity } from '../../../../lib/openings/client';
import { toRepositoryProps } from '../../../../lib/openings/mappers';

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
    return res.status(400).json({ error: 'Parâmetros inválidos.' });
  }

  try {
    const community = await findCommunity(`${owner}/${repo}`);
    if (!community) {
      return res.status(404).json({ error: 'Repositório não encontrado.' });
    }

    res.setHeader(
      'Cache-Control',
      'public, s-maxage=3600, stale-while-revalidate=86400',
    );
    return res.status(200).json(toRepositoryProps(community));
  } catch {
    return res.status(502).json({ error: 'Erro ao carregar repositório.' });
  }
}
