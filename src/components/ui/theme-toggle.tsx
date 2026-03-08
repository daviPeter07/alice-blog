'use client';

import { useTheme as useNextThemes } from 'next-themes';
import { Moon, Sun } from 'lucide-react';
import { useEffect, useState } from 'react';

export interface ThemeToggleProps {
  className?: string;
  ariaLabel?: string;
}

export function ThemeToggle({
  className = '',
  ariaLabel = 'Alternar tema claro/escuro',
}: ThemeToggleProps) {
  const { resolvedTheme, setTheme } = useNextThemes();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);

  const toggleTheme = () => {
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
  };

  // Evita hydration mismatch: servidor e primeiro paint do cliente renderizam o mesmo ícone.
  // Após mount, exibimos o ícone correto conforme o tema (lido do localStorage).
  if (!mounted) {
    return (
      <button
        type="button"
        aria-label={ariaLabel}
        disabled
        className={
          className ||
          'flex h-9 w-9 items-center justify-center rounded-md border border-border bg-transparent text-foreground'
        }
      >
        <Moon size={18} aria-hidden />
      </button>
    );
  }

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
