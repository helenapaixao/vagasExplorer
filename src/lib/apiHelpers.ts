import type { NextApiRequest, NextApiResponse } from 'next';

/**
 * Replies 405 and returns false when the request method isn't allowed.
 */
export function allowMethods(
  req: NextApiRequest,
  res: NextApiResponse,
  methods: string[],
): boolean {
  if (methods.includes(req.method ?? '')) return true;

  res.setHeader('Allow', methods.join(', '));
  res.status(405).json({ error: 'Method not allowed' });
  return false;
}

export function setCacheHeader(
  res: NextApiResponse,
  sMaxAge: number,
  staleWhileRevalidate: number,
): void {
  res.setHeader(
    'Cache-Control',
    `public, s-maxage=${sMaxAge}, stale-while-revalidate=${staleWhileRevalidate}`,
  );
}

/** Returns the query param when it is a single string, otherwise null. */
export function singleParam(
  value: string | string[] | undefined,
): string | null {
  return typeof value === 'string' && value.length > 0 ? value : null;
}

export function clampInt(value: unknown, min: number, max: number): number {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return min;
  return Math.min(max, Math.max(min, Math.trunc(parsed)));
}
