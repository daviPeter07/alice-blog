'use client';

import { useIntersectionReveal } from '@/hooks/use-intersection-reveal';
import { cn } from '@/lib/utils';

export interface RevealSectionWrapperProps {
  children: React.ReactNode;
  className?: string;
}

export function RevealSectionWrapper({ children, className }: RevealSectionWrapperProps) {
  const ref = useIntersectionReveal<HTMLDivElement>();
  return (
    <div ref={ref} className={cn('reveal-section', className)}>
      {children}
    </div>
  );
}
