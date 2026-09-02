export class HttpError extends Error {
  readonly status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = 'HttpError';
    this.status = status;
  }
}

const RATE_LIMIT_MESSAGE =
  'Limite da API do GitHub atingido. Configure GITHUB_TOKEN no .env (veja .env.example).';

/**
 * Maps an error thrown by the GitHub layer to the status/message pair sent to
 * the client. Keeps every API route reporting failures the same way.
 */
export function toApiError(
  err: unknown,
  fallbackMessage: string,
  notFoundMessage = 'Não encontrado.',
): { status: number; message: string } {
  const status = err instanceof HttpError ? err.status : 500;

  if (status === 404) return { status, message: notFoundMessage };
  if (status === 403 || status === 429) {
    return { status, message: RATE_LIMIT_MESSAGE };
  }

  return { status, message: fallbackMessage };
}
