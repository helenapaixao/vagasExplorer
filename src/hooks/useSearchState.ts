import { useCallback, useMemo } from 'react';
import { useRouter } from 'next/router';
import {
  FILTER_GROUPS,
  parseFilters,
  type ActiveFilters,
} from '../lib/filters';

/** Keys this hook owns in the URL; anything else in the query is left alone. */
const OWNED_KEYS = ['q', 'page', ...FILTER_GROUPS.map(g => g.id)];

function single(value: string | string[] | undefined): string {
  const raw = Array.isArray(value) ? value[0] : value;
  return raw ?? '';
}

/**
 * Search, filters and page live in the URL so results can be shared, the back
 * button works, and returning from a job detail restores the search.
 */
export function useSearchState() {
  const router = useRouter();

  const q = single(router.query.q);
  const page = Math.max(1, Number(single(router.query.page)) || 1);
  const filters = useMemo(() => parseFilters(router.query), [router.query]);

  const apply = useCallback(
    (patch: Record<string, string | number | undefined>) => {
      const next: Record<string, string> = {};

      // Preserve query keys belonging to the route (e.g. dynamic segments).
      Object.entries(router.query).forEach(([key, value]) => {
        if (!OWNED_KEYS.includes(key)) next[key] = single(value);
      });

      const merged = {
        q,
        page,
        ...filters,
        ...patch,
      } as Record<string, string | number | undefined>;

      OWNED_KEYS.forEach(key => {
        const value = merged[key];
        if (value === undefined || value === '' || value === null) return;
        // Page 1 is the default; keeping it out makes shareable URLs cleaner.
        if (key === 'page' && Number(value) === 1) return;
        next[key] = String(value);
      });

      router.replace({ pathname: router.pathname, query: next }, undefined, {
        shallow: true,
        scroll: false,
      });
    },
    [router, q, page, filters],
  );

  const setQuery = useCallback(
    (value: string) => apply({ q: value || undefined, page: 1 }),
    [apply],
  );

  const setPage = useCallback(
    (value: number) => apply({ page: Math.max(1, value) }),
    [apply],
  );

  const setFilter = useCallback(
    (groupId: string, value: string | null) =>
      apply({ [groupId]: value ?? undefined, page: 1 }),
    [apply],
  );

  const clearFilters = useCallback(() => {
    const cleared: Record<string, undefined> = {};
    FILTER_GROUPS.forEach(group => {
      cleared[group.id] = undefined;
    });
    apply({ ...cleared, page: 1 });
  }, [apply]);

  const clearAll = useCallback(() => {
    const cleared: Record<string, undefined> = {};
    FILTER_GROUPS.forEach(group => {
      cleared[group.id] = undefined;
    });
    apply({ ...cleared, q: undefined, page: 1 });
  }, [apply]);

  return {
    q,
    page,
    filters: filters as ActiveFilters,
    ready: router.isReady,
    setQuery,
    setPage,
    setFilter,
    clearFilters,
    clearAll,
  };
}
