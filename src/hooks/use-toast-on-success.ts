'use client';

import { useEffect, useRef } from 'react';
import { toast } from 'sonner';

type StateWithSuccess = { success?: boolean } | null;

/**
 * Exibe um toast de sucesso quando o estado indica sucesso (success === true).
 * Usa ref para evitar toasts duplicados quando o efeito roda mais de uma vez (ex.: Strict Mode).
 */
export function useToastOnSuccess(state: StateWithSuccess, message: string): void {
  const lastToastedRef = useRef<StateWithSuccess>(null);

  useEffect(() => {
    if (state?.success !== true || state === lastToastedRef.current) return;
    lastToastedRef.current = state;
    toast.success(message);
  }, [state, message]);
}
