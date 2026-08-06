import React, { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { Check, Monitor, Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const OPTIONS = [
  { value: 'light', label: 'Claro', icon: Sun },
  { value: 'dark', label: 'Escuro', icon: Moon },
  { value: 'system', label: 'Sistema', icon: Monitor },
];

const ThemeMenu: React.FC = () => {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // The active theme isn't known on the server, so the icon only commits
  // after hydration to avoid a mismatch.
  useEffect(() => setMounted(true), []);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Alternar tema">
          {mounted && resolvedTheme === 'dark' ? <Sun /> : <Moon />}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {OPTIONS.map(option => (
          <DropdownMenuItem
            key={option.value}
            onClick={() => setTheme(option.value)}
            className="gap-2"
          >
            <option.icon aria-hidden />
            {option.label}
            {mounted && theme === option.value && (
              <Check className="ml-auto text-primary" aria-hidden />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ThemeMenu;
