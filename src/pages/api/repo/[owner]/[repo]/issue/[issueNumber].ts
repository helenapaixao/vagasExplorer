import type { NextApiRequest, NextApiResponse } from 'next';
import { findOpportunityByIssue } from '../../../../../../lib/openings/client';
import { toIssueProps } from '../../../../../../lib/openings/mappers';

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
    return res.status(400).json({ error: 'Parâmetros inválidos.' });
  }

  const number = Number.parseInt(issueNumber, 10);
  if (Number.isNaN(number)) {
    return res.status(400).json({ error: 'Número de vaga inválido.' });
  }

  try {
    const opportunity = await findOpportunityByIssue(
      `${owner}/${repo}`,
      number,
    );
    if (!opportunity) {
      return res.status(404).json({ error: 'Vaga não encontrada.' });
    }

    res.setHeader(
      'Cache-Control',
      'public, s-maxage=600, stale-while-revalidate=3600',
    );
    return res.status(200).json(toIssueProps(opportunity));
  } catch {
    return res.status(502).json({ error: 'Erro ao carregar vaga.' });
  }
}
