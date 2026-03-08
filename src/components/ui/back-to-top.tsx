'use client';

import { useEffect, useState } from 'react';
import { ArrowUp } from 'lucide-react';

export interface BackToTopProps {
  threshold?: number;
  className?: string;
}

export function BackToTop({ threshold = 400, className = '' }: BackToTopProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > threshold);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [threshold]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!visible) return null;

  return (
    <button
      type="button"
      onClick={scrollToTop}
      aria-label="Voltar ao topo"
      className={
        className ||
        'fixed bottom-6 right-6 z-40 flex h-11 w-11 items-center justify-center rounded-full border shadow-md transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ' +
          'bg-card text-foreground border-border hover:bg-accent ' +
          'theme-light:bg-brand-brown theme-light:text-white theme-light:border-brand-brown/30 theme-light:hover:bg-brand-brown/90 ' +
          'theme-dark:bg-white theme-dark:text-black theme-dark:border-white/20 theme-dark:hover:bg-white/90 ' +
          '[&_svg]:stroke-[2.5px] [&_svg]:text-current'
      }
    >
      <ArrowUp size={20} aria-hidden className="shrink-0" />
    </button>
  );
}
