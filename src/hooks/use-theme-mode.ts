'use client';

import { useCallback } from 'react';
import { useTheme } from 'next-themes';
import { isNightHour, type ThemeMode } from '@/lib/preferences';
import { usePreferences } from './use-preferences';

export const resolveAutoTheme = (date = new Date()) =>
  isNightHour(date.getHours()) ? 'dark' : 'light';

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
      setTheme(mode === 'auto' ? resolveAutoTheme() : mode);
    },
    [setTheme, updatePreferences]
  );

  return { themeMode: preferences.themeMode, resolvedTheme, setThemeMode };
};
