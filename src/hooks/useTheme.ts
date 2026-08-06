import { useCallback, useEffect, useState } from 'react';

export type Theme = 'light' | 'dark';

const STORAGE_KEY = 'theme';

function currentTheme(): Theme {
  return document.documentElement.classList.contains('dark') ? 'dark' : 'light';
}

/**
 * Reads the theme the inline script in `_document` already applied, so the
 * toggle never fights it. `mounted` stays false until hydration finishes,
 * letting callers avoid rendering a server/client mismatch.
 */
export function useTheme() {
  const [theme, setTheme] = useState<Theme>('light');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setTheme(currentTheme());
    setMounted(true);
  }, []);

  const toggle = useCallback(() => {
    const next = currentTheme() === 'dark' ? 'light' : 'dark';
    document.documentElement.classList.toggle('dark', next === 'dark');
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // Private mode / storage disabled: the theme still applies this session.
    }
    setTheme(next);
  }, []);

  return { theme, toggle, mounted };
}
