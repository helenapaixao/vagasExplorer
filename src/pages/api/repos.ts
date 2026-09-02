import type { NextApiRequest, NextApiResponse } from 'next';
import type { RepoItem } from '../../lib/repos';
import { allowMethods, setCacheHeader } from '../../lib/apiHelpers';
import { toApiError } from '../../lib/httpError';
import {
  loadCommunities,
  loadOpportunityCounts,
} from '../../lib/openings/client';
import { describeCommunity } from '../../lib/openings/mappers';
import type { OpeningsCommunity } from '../../lib/openings/types';

export type { RepoItem };

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
  if (!allowMethods(req, res, ['GET'])) return;

  try {
    const [communities, counts] = await Promise.all([
      loadCommunities(),
      loadOpportunityCounts(),
    ]);

    // A contagem vem do catálogo, não do `opportunitiesCount` do snapshot:
    // aquele campo conta reposts e credita a mesma vaga a repositórios
    // espelhados, então o card prometeria mais vagas do que a listagem entrega.
    const data: RepoItem[] = communities
      .map(community => ({
        community,
        openings: counts.get(community.repository.toLowerCase()) ?? 0,
      }))
      // Comunidade sem vaga aberta vira card que abre vazio: fora da listagem.
      .filter(({ openings }) => openings > 0)
      .sort(byBrazilThenSize)
      .map(({ community, openings }) => ({
        link: `/repository/${community.repository}`,
        imageUrl: community.avatarUrl,
        // Vários owners publicam em mais de um repo (jobright-ai tem 9): sem o
        // nome do repositório os cards ficam indistinguíveis na listagem.
        name: community.repository,
        desc: describeCommunity(community, openings),
      }));

    setCacheHeader(res, 3600, 86400);
    res.status(200).json(data);
  } catch (err) {
    const { status, message } = toApiError(
      err,
      'Erro ao carregar repositórios.',
    );
    res.status(status).json({ error: message });
  }
}
