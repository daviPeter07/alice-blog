'use client';

import { ThemeProvider as NextThemesProvider } from 'next-themes';

const STORAGE_KEY = 'alice-theme';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider
      attribute="data-theme"
      storageKey={STORAGE_KEY}
      enableSystem
      defaultTheme="system"
      disableTransitionOnChange={false}
    >
      {children}
    </NextThemesProvider>
  );
}
