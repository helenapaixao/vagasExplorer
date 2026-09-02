import type { NextApiRequest, NextApiResponse } from 'next';
import { loadOpportunitiesByRepository } from '../../../../../lib/openings/client';
import { toIssueProps } from '../../../../../lib/openings/mappers';

const DEFAULT_PER_PAGE = 10;
const MAX_PER_PAGE = 100;

function parsePositiveInt(value: unknown, fallback: number): number {
  const parsed = Number.parseInt(String(value ?? ''), 10);
  return Number.isNaN(parsed) || parsed < 1 ? fallback : parsed;
}

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

  const page = parsePositiveInt(req.query.page, 1);
  const perPage = Math.min(
    parsePositiveInt(req.query.per_page, DEFAULT_PER_PAGE),
    MAX_PER_PAGE,
  );

  try {
    const opportunities = await loadOpportunitiesByRepository(
      `${owner}/${repo}`,
    );
    const start = (page - 1) * perPage;
    const items = opportunities.slice(start, start + perPage).map(toIssueProps);

    res.setHeader(
      'Cache-Control',
      'public, s-maxage=600, stale-while-revalidate=3600',
    );
    return res.status(200).json(items);
  } catch {
    return res.status(502).json({ error: 'Erro ao carregar vagas.' });
  }
}
