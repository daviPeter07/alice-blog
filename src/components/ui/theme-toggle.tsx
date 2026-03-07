'use client';

import { useTheme as useNextThemes } from 'next-themes';
import { Moon, Sun } from 'lucide-react';

export interface ThemeToggleProps {
  className?: string;
  ariaLabel?: string;
}

export function ThemeToggle({
  className = '',
  ariaLabel = 'Alternar tema claro/escuro',
}: ThemeToggleProps) {
  const { resolvedTheme, setTheme } = useNextThemes();

  const toggleTheme = () => {
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
  };

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={ariaLabel}
      className={
        className ||
        'flex h-9 w-9 items-center justify-center rounded-md border border-border bg-transparent text-foreground transition hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
      }
    >
      {resolvedTheme === 'dark' ? <Sun size={18} aria-hidden /> : <Moon size={18} aria-hidden />}
    </button>
  );
}
