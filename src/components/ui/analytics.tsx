'use client';

import { useState, useEffect } from 'react';
import { Analytics } from '@vercel/analytics/next';

export function ClientAnalytics() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);

  if (!mounted) return null;
  return <Analytics />;
}
