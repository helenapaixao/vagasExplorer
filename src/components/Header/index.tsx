import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Bookmark } from 'lucide-react';
import Logo from '../Logo';
import ThemeToggle from '../ThemeToggle';
import { useSavedJobs } from '../../hooks/useSavedJobs';

const NAV = [
  { href: '/vagas', label: 'Buscar vagas' },
  { href: '/dashboard', label: 'Repositórios' },
];

const Header: React.FC = () => {
  const router = useRouter();
  const { saved, mounted } = useSavedJobs();

  return (
    <header className="mb-6 flex flex-wrap items-center justify-between gap-4 py-4">
      <Link
        href="/"
        className="flex items-center gap-3 no-underline text-foreground"
      >
        <Logo />
        <span className="text-lg font-bold">vagasExplorer</span>
      </Link>

      <nav className="flex items-center gap-1 sm:gap-3">
        {NAV.map(item => (
          <Link
            key={item.href}
            href={item.href}
            aria-current={
              router.pathname.startsWith(item.href) ? 'page' : undefined
            }
            className={
              router.pathname.startsWith(item.href)
                ? 'rounded-md px-2 py-1 text-sm font-medium text-foreground'
                : 'rounded-md px-2 py-1 text-sm text-muted-foreground hover:text-foreground'
            }
          >
            {item.label}
          </Link>
        ))}

        <Link
          href="/salvas"
          aria-label={`Vagas salvas${mounted ? ` (${saved.length})` : ''}`}
          className="flex items-center gap-1 rounded-md px-2 py-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <Bookmark size={16} aria-hidden />
          {/* Rendered only after hydration: localStorage isn't readable on the
              server, and a mismatched count would flash. */}
          {mounted && saved.length > 0 && (
            <span className="rounded-full bg-primary px-1.5 text-xs text-primary-foreground">
              {saved.length}
            </span>
          )}
        </Link>

        <ThemeToggle />
      </nav>
    </header>
  );
};

export default Header;
