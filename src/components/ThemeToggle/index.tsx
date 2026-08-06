import React from 'react';
import { FiMoon, FiSun } from 'react-icons/fi';
import { useTheme } from '../../hooks/useTheme';

const ThemeToggle: React.FC = () => {
  const { theme, toggle, mounted } = useTheme();

  return (
    <button
      type="button"
      onClick={toggle}
      // Before hydration the real theme isn't known, so the label stays
      // generic instead of claiming the wrong one.
      aria-label={
        mounted
          ? `Mudar para tema ${theme === 'dark' ? 'claro' : 'escuro'}`
          : 'Alternar tema'
      }
      className="flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
    >
      {mounted && theme === 'dark' ? (
        <FiSun size={18} aria-hidden />
      ) : (
        <FiMoon size={18} aria-hidden />
      )}
    </button>
  );
};

export default ThemeToggle;
