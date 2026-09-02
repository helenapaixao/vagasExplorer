import type { NextApiRequest, NextApiResponse } from 'next';
import { loadManifest } from '../../lib/openings/client';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // O manifest já publica o total consolidado; não há o que somar.
    const { totals } = await loadManifest();

    res.setHeader(
      'Cache-Control',
      'public, s-maxage=300, stale-while-revalidate=600',
    );
    return res.status(200).json({ total: totals.openOpportunities });
  } catch {
    return res.status(502).json({ error: 'Erro ao calcular total de vagas.' });
  }
}
