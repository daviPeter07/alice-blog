'use client';

import { useCallback } from 'react';
import { useTheme } from 'next-themes';
import { DEFAULT_PREFERENCES, isNightHour, type ThemeMode } from '@/lib/preferences';
import { usePreferences } from './use-preferences';

export const resolveAutoTheme = (date = new Date()) =>
  isNightHour(date.getHours()) ? 'dark' : 'light';

const toNextTheme = (mode: ThemeMode) => (mode === 'auto' ? resolveAutoTheme() : mode);

/**
 * Une o next-themes (claro/escuro/sistema) ao modo "automático por horário",
 * que o next-themes não conhece: nesse modo o tema real é calculado aqui.
 */
export const useThemeMode = () => {
  const { setTheme, resolvedTheme } = useTheme();
  const { preferences, updatePreferences } = usePreferences();

  const setThemeMode = useCallback(
    (mode: ThemeMode) => {
      updatePreferences({ themeMode: mode });
      setTheme(toNextTheme(mode));
    },
    [setTheme, updatePreferences]
  );

  /** Volta todas as preferências ao padrão, inclusive o tema aplicado */
  const resetPreferences = useCallback(() => {
    updatePreferences(DEFAULT_PREFERENCES);
    setTheme(toNextTheme(DEFAULT_PREFERENCES.themeMode));
  }, [setTheme, updatePreferences]);

  return { themeMode: preferences.themeMode, resolvedTheme, setThemeMode, resetPreferences };
};
