import type { NextApiRequest, NextApiResponse } from 'next';
import { readFileSync } from 'fs';
import { join } from 'path';

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
    const path = join(process.cwd(), 'public', 'repos.json');
    const raw = readFileSync(path, 'utf-8');
    const data = JSON.parse(raw) as RepoItem[];
    res.setHeader(
      'Cache-Control',
      'public, s-maxage=3600, stale-while-revalidate=86400',
    );
    return res.status(200).json(data);
  } catch {
    return res.status(500).json({ error: 'Erro ao carregar repositórios.' });
  }
}
