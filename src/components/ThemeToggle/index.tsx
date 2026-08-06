import React from 'react';
import dynamic from 'next/dynamic';
import { Moon } from 'lucide-react';
import { Button } from '@/components/ui/button';

/**
 * The menu pulls in a popover library, and the header renders on every page.
 * Loading it lazily keeps that out of the initial bundle; the placeholder is
 * the same size, so nothing shifts when it swaps in.
 */
const ThemeMenu = dynamic(() => import('./ThemeMenu'), {
  ssr: false,
  loading: () => (
    <Button variant="ghost" size="icon" aria-label="Alternar tema" disabled>
      <Moon />
    </Button>
  ),
});

const ThemeToggle: React.FC = () => <ThemeMenu />;

export default ThemeToggle;
