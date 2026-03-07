'use client';

import { useEffect } from 'react';
import { toast } from 'sonner';

type StateWithSuccess = { success?: boolean } | null;

/**
 * Exibe um toast de sucesso quando o estado indica sucesso (success === true).
 * Útil após Server Actions que retornam { success: true }.
 */
export function useToastOnSuccess(state: StateWithSuccess, message: string): void {
  useEffect(() => {
    if (state?.success === true) {
      toast.success(message);
    }
  }, [state, message]);
}
