'use client';

import { useEffect } from 'react';
import { ThemeProvider as NextThemesProvider, useTheme } from 'next-themes';
import { usePreferences } from '@/hooks/use-preferences';
import { resolveAutoTheme } from '@/hooks/use-theme-mode';
import { THEME_STORAGE_KEY } from '@/lib/preferences';

const AUTO_THEME_CHECK_MS = 60_000;

/** No modo automático, troca o tema quando o horário cruza 6h/18h com a página aberta */
function AutoThemeScheduler() {
  const { preferences } = usePreferences();
  const { setTheme, resolvedTheme } = useTheme();
  const isAuto = preferences.themeMode === 'auto';

  useEffect(() => {
    if (!isAuto) return;
    const check = () => {
      const target = resolveAutoTheme();
      if (target !== resolvedTheme) setTheme(target);
    };
    check();
    const id = setInterval(check, AUTO_THEME_CHECK_MS);
    return () => clearInterval(id);
  }, [isAuto, resolvedTheme, setTheme]);

  return null;
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider
      attribute="data-theme"
      storageKey={THEME_STORAGE_KEY}
      enableSystem
      defaultTheme="system"
      disableTransitionOnChange={false}
    >
      <AutoThemeScheduler />
      {children}
    </NextThemesProvider>
  );
}
