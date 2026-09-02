import { useCallback, useEffect, useState } from 'react';
import type { SavedJob } from '../types/job';

const STORAGE_KEY = 'saved-jobs';
const CHANGE_EVENT = 'saved-jobs:change';

export function jobKey(owner: string, repo: string, issueNumber: number) {
  return `${owner}/${repo}#${issueNumber}`;
}

function read(): SavedJob[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? (parsed as SavedJob[]) : [];
  } catch {
    return [];
  }
}

function write(jobs: SavedJob[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(jobs));
  } catch {
    // Storage full or disabled: nothing to do, state stays in memory.
  }
  // Keeps every mounted hook (cards, header counter, saved page) in sync.
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

/**
 * Saved jobs live in localStorage, so the feature needs no backend or login.
 * Reading is deferred to an effect because localStorage doesn't exist during
 * SSR.
 */
export function useSavedJobs() {
  const [saved, setSaved] = useState<SavedJob[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const sync = () => setSaved(read());
    sync();
    setMounted(true);

    window.addEventListener(CHANGE_EVENT, sync);
    // `storage` fires when another tab changes the list.
    window.addEventListener('storage', sync);
    return () => {
      window.removeEventListener(CHANGE_EVENT, sync);
      window.removeEventListener('storage', sync);
    };
  }, []);

  const isSaved = useCallback(
    (key: string) => saved.some(job => job.key === key),
    [saved],
  );

  const toggle = useCallback((job: Omit<SavedJob, 'savedAt'>) => {
    const current = read();
    const exists = current.some(item => item.key === job.key);
    write(
      exists
        ? current.filter(item => item.key !== job.key)
        : [{ ...job, savedAt: new Date().toISOString() }, ...current],
    );
  }, []);

  const remove = useCallback((key: string) => {
    write(read().filter(item => item.key !== key));
  }, []);

  const clear = useCallback(() => write([]), []);

  return { saved, isSaved, toggle, remove, clear, mounted };
}
