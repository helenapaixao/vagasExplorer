import type { NextApiRequest, NextApiResponse } from 'next';
import { loadCommunities } from '../../lib/openings/client';
import { describeCommunity } from '../../lib/openings/mappers';

export type RepoItem = {
  link: string;
  imageUrl: string;
  name: string;
  desc: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const communities = await loadCommunities();

    const data: RepoItem[] = communities
      .slice()
      .sort((a, b) => b.opportunitiesCount - a.opportunitiesCount)
      .map(community => ({
        link: `/repository/${community.repository}`,
        imageUrl: community.avatarUrl,
        name: community.name,
        desc: describeCommunity(community),
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
