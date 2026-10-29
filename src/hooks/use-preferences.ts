'use client';

import { useCallback, useSyncExternalStore } from 'react';
import {
  DEFAULT_PREFERENCES,
  PREFERENCES_STORAGE_KEY,
  READING_SCALE,
  applyPreferences,
  parsePreferences,
  type Preferences,
} from '@/lib/preferences';

const listeners = new Set<() => void>();
// Fonte da verdade em memória: o localStorage só persiste. Assim a escolha vale nesta
// visita mesmo quando o storage está bloqueado ou cheio (modo privado, cota estourada).
let current: Preferences | null = null;

const readStorage = (): Preferences => {
  try {
    const raw = localStorage.getItem(PREFERENCES_STORAGE_KEY);
    return parsePreferences(raw ? JSON.parse(raw) : {});
  } catch {
    return DEFAULT_PREFERENCES;
  }
};

const getSnapshot = (): Preferences => (current ??= readStorage());

const getServerSnapshot = () => DEFAULT_PREFERENCES;

const setCurrent = (next: Preferences) => {
  current = next;
  applyPreferences(next, READING_SCALE);
  listeners.forEach((l) => l());
};

// Um único listener de storage para todos os assinantes: outra aba mudou as preferências
const onStorage = (e: StorageEvent) => {
  if (e.key === PREFERENCES_STORAGE_KEY) setCurrent(readStorage());
};

const subscribe = (listener: () => void) => {
  if (listeners.size === 0) window.addEventListener('storage', onStorage);
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
    if (listeners.size === 0) window.removeEventListener('storage', onStorage);
  };
};

/**
 * Preferências salvas neste navegador. Para trocar o tema ou restaurar o padrão,
 * use useThemeMode — ele mantém o next-themes em sincronia.
 */
export const usePreferences = () => {
  const preferences = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const updatePreferences = useCallback((patch: Partial<Preferences>) => {
    const next = { ...getSnapshot(), ...patch };
    try {
      localStorage.setItem(PREFERENCES_STORAGE_KEY, JSON.stringify(next));
    } catch {
      // Sem persistência: segue valendo em memória até recarregar
    }
    setCurrent(next);
  }, []);

  return { preferences, updatePreferences };
};
