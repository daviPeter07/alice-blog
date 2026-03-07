import type { LandingSectionVariant } from '@/types/landing';

const variantClasses: Record<LandingSectionVariant, string> = {
  hero: 'bg-cloud-dancer',
  featured: 'bg-landing-cream py-16 px-6',
  categories: 'bg-landing-sage py-16 px-6',
  'categories-alt': 'bg-landing-warm py-12 px-6',
  footer: 'bg-background/30',
};

export interface LandingSectionProps {
  variant: LandingSectionVariant;
  children: React.ReactNode;
  className?: string;
  /** Para seções com conteúdo centralizado (não hero) */
  narrow?: boolean;
}

export function LandingSection({
  variant,
  children,
  className = '',
  narrow = true,
}: LandingSectionProps) {
  const base = variantClasses[variant];
  const container = narrow && variant !== 'hero' ? 'max-w-2xl mx-auto' : '';

  if (variant === 'hero') {
    return <section className={`${base} ${className}`.trim()}>{children}</section>;
  }

  return (
    <section className={`${base} ${className}`.trim()}>
      <div className={container}>{children}</div>
    </section>
  );
}
