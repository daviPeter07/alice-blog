'use client';

import { usePreferencesDialog } from './preferences-dialog';
import type { PreferencesSection } from './preferences-panel';

export interface OpenPreferencesButtonProps {
  section?: PreferencesSection;
  className?: string;
  children: React.ReactNode;
  'aria-label'?: string;
}

/** Botão para abrir o painel de preferências a partir de Server Components */
export function OpenPreferencesButton({
  section,
  className,
  children,
  'aria-label': ariaLabel,
}: OpenPreferencesButtonProps) {
  const { openPreferences } = usePreferencesDialog();
  return (
    <button
      type="button"
      onClick={() => openPreferences(section)}
      className={className}
      aria-label={ariaLabel}
    >
      {children}
    </button>
  );
}
