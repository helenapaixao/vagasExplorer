import { HttpError } from './httpError';

/**
 * Calls the app's own API routes. GitHub is only ever reached server-side, so
 * the browser never needs a token or the GitHub base URL.
 */
export async function fetchJson<T>(
  path: string,
  params?: Record<string, string | number | undefined>,
  signal?: AbortSignal,
): Promise<T> {
  const query = new URLSearchParams();
  Object.entries(params ?? {}).forEach(([key, value]) => {
    if (value !== undefined && value !== '') query.set(key, String(value));
  });

  const url = query.size > 0 ? `${path}?${query}` : path;
  const res = await fetch(url, { signal });

  if (!res.ok) {
    const body = await res.json().catch(() => null);
    const message =
      body && typeof body.error === 'string'
        ? body.error
        : `Erro ${res.status}`;
    throw new HttpError(res.status, message);
  }

  return (await res.json()) as T;
}
