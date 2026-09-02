import type { NextApiRequest, NextApiResponse } from 'next';
import {
  loadCommunities,
  loadOpportunityCounts,
} from '../../lib/openings/client';
import { describeCommunity } from '../../lib/openings/mappers';
import type { OpeningsCommunity } from '../../lib/openings/types';

export type RepoItem = {
  link: string;
  imageUrl: string;
  name: string;
  desc: string;
};

/** O público do app é brasileiro: comunidades do Brasil abrem a lista. */
function isBrazilian(community: OpeningsCommunity): boolean {
  return community.countryCode.toUpperCase() === 'BR';
}

type RankedCommunity = { community: OpeningsCommunity; openings: number };

function byBrazilThenSize(a: RankedCommunity, b: RankedCommunity): number {
  const brazilFirst =
    Number(isBrazilian(b.community)) - Number(isBrazilian(a.community));
  return brazilFirst || b.openings - a.openings;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const [communities, counts] = await Promise.all([
      loadCommunities(),
      loadOpportunityCounts(),
    ]);

    const data: RepoItem[] = communities
      .map(community => ({
        community,
        openings: counts.get(community.repository.toLowerCase()) ?? 0,
      }))
      // Comunidade sem vaga aberta vira card vazio: fora da listagem.
      .filter(({ openings }) => openings > 0)
      .sort(byBrazilThenSize)
      .map(({ community, openings }) => ({
        link: `/repository/${community.repository}`,
        imageUrl: community.avatarUrl,
        // Vários owners publicam em mais de um repo (jobright-ai tem 9): sem o
        // nome do repo os cards ficam indistinguíveis na listagem.
        name: community.repository,
        desc: describeCommunity(community, openings),
      }));

    res.setHeader(
      'Cache-Control',
      'public, s-maxage=3600, stale-while-revalidate=86400',
    );
    return res.status(200).json(data);
  } catch {
    return res.status(502).json({ error: 'Erro ao carregar repositórios.' });
  }
}
