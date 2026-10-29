'use client';

import { useCallback, useSyncExternalStore } from 'react';
import {
  DEFAULT_PREFERENCES,
  PREFERENCES_STORAGE_KEY,
  applyPreferences,
  parsePreferences,
  type Preferences,
} from '@/lib/preferences';

const listeners = new Set<() => void>();
let cached: { raw: string | null; value: Preferences } | null = null;
// Fallback quando o storage está bloqueado (ex.: modo privado): vale só nesta visita
let memoryRaw: string | null = null;

const readRaw = (): string | null => {
  try {
    return localStorage.getItem(PREFERENCES_STORAGE_KEY) ?? memoryRaw;
  } catch {
    return memoryRaw;
  }
};

// Snapshot estável enquanto o JSON não muda (exigência do useSyncExternalStore)
const getSnapshot = (): Preferences => {
  const raw = readRaw();
  if (cached && cached.raw === raw) return cached.value;
  let parsed: unknown = {};
  try {
    parsed = raw ? JSON.parse(raw) : {};
  } catch {
    parsed = {};
  }
  cached = { raw, value: parsePreferences(parsed) };
  return cached.value;
};

const getServerSnapshot = () => DEFAULT_PREFERENCES;

const subscribe = (listener: () => void) => {
  listeners.add(listener);
  const onStorage = (e: StorageEvent) => {
    if (e.key === PREFERENCES_STORAGE_KEY) {
      applyPreferences(getSnapshot());
      listener();
    }
  };
  window.addEventListener('storage', onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener('storage', onStorage);
  };
};

export const usePreferences = () => {
  const preferences = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const updatePreferences = useCallback((patch: Partial<Preferences>) => {
    const next = { ...getSnapshot(), ...patch };
    const raw = JSON.stringify(next);
    try {
      localStorage.setItem(PREFERENCES_STORAGE_KEY, raw);
    } catch {
      memoryRaw = raw;
    }
    applyPreferences(next);
    listeners.forEach((l) => l());
  }, []);

  const resetPreferences = useCallback(() => {
    updatePreferences(DEFAULT_PREFERENCES);
  }, [updatePreferences]);

  return { preferences, updatePreferences, resetPreferences };
};
