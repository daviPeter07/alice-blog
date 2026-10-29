'use client';

import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { PreferencesPanel, type PreferencesSection } from './preferences-panel';
import { cn } from '@/lib/utils';

interface PreferencesDialogContextValue {
  openPreferences: (section?: PreferencesSection) => void;
}

const PreferencesDialogContext = createContext<PreferencesDialogContextValue | null>(null);

export const usePreferencesDialog = () => {
  const ctx = useContext(PreferencesDialogContext);
  if (!ctx) throw new Error('usePreferencesDialog precisa estar dentro de PreferencesProvider');
  return ctx;
};

export function PreferencesProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [section, setSection] = useState<PreferencesSection | undefined>();

  const openPreferences = useCallback((next?: PreferencesSection) => {
    setSection(next);
    setOpen(true);
  }, []);

  const value = useMemo(() => ({ openPreferences }), [openPreferences]);

  return (
    <PreferencesDialogContext.Provider value={value}>
      {children}
      <Dialog.Root open={open} onOpenChange={setOpen}>
        <Dialog.Portal>
          <Dialog.Overlay
            className={cn(
              'fixed inset-0 z-50 bg-black/50 backdrop-blur-sm',
              'data-[state=open]:animate-in data-[state=closed]:animate-out',
              'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0'
            )}
          />
          <Dialog.Content
            className={cn(
              'fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col border-l border-border bg-background shadow-2xl',
              'data-[state=open]:animate-in data-[state=closed]:animate-out',
              'data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right duration-300'
            )}
          >
            <div className="flex items-start justify-between gap-4 border-b border-border px-6 py-5">
              <div>
                <Dialog.Title className="font-heading text-xl font-semibold text-foreground">
                  Personalizar
                </Dialog.Title>
                <Dialog.Description className="font-ui text-sm text-muted-foreground">
                  Deixe o Alice do seu jeito.
                </Dialog.Description>
              </div>
              <Dialog.Close
                className="flex size-9 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                aria-label="Fechar"
              >
                <X className="size-5" aria-hidden />
              </Dialog.Close>
            </div>
            <div className="flex-1 overflow-y-auto px-6 py-6">
              <PreferencesPanel initialSection={section} />
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </PreferencesDialogContext.Provider>
  );
}
