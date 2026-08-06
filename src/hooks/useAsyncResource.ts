import { useCallback, useEffect, useState } from 'react';

interface AsyncResource<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  reload: () => void;
}

/**
 * Runs `load` whenever `deps` change, cancelling the in-flight request first so
 * a slow earlier response can't overwrite a newer one.
 */
export function useAsyncResource<T>(
  load: ((signal: AbortSignal) => Promise<T>) | null,
  deps: unknown[],
  fallbackError: string,
): AsyncResource<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(load !== null);
  const [error, setError] = useState<string | null>(null);
  const [reloadToken, setReloadToken] = useState(0);

  const reload = useCallback(() => setReloadToken(n => n + 1), []);

  useEffect(() => {
    if (!load) {
      setLoading(false);
      return undefined;
    }

    const controller = new AbortController();
    setLoading(true);
    setError(null);

    load(controller.signal)
      .then(result => {
        if (controller.signal.aborted) return;
        setData(result);
      })
      .catch((err: unknown) => {
        if (controller.signal.aborted) return;
        setData(null);
        setError(err instanceof Error ? err.message : fallbackError);
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });

    return () => controller.abort();
    // `load` is recreated on every render by design; `deps` is the real trigger.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, reloadToken]);

  return { data, loading, error, reload };
}
