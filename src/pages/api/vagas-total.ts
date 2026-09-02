import type { NextApiRequest, NextApiResponse } from 'next';
import { loadDedupedCatalog } from '../../lib/openings/client';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // O total do manifest conta os reposts que a listagem esconde; contar o
    // catálogo deduplicado mantém a home coerente com o que o app entrega.
    const catalog = await loadDedupedCatalog();

    res.setHeader(
      'Cache-Control',
      'public, s-maxage=300, stale-while-revalidate=600',
    );
    return res.status(200).json({ total: catalog.length });
  } catch {
    return res.status(502).json({ error: 'Erro ao calcular total de vagas.' });
  }
}
