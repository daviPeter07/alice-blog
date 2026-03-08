import type { LandingSectionVariant } from '@/types/landing';
import { cn } from '@/lib/utils';

export type LandingSectionLayout = 'text-left' | 'text-right' | 'center';

const variantClasses: Record<LandingSectionVariant, string> = {
  hero: 'bg-cloud-dancer',
  featured: 'bg-landing-cream py-16 px-6',
  categories: 'bg-landing-sage py-16 px-6',
  'categories-alt': 'bg-landing-warm py-12 px-6',
  footer: 'bg-background/30',
};

const layoutClasses: Record<LandingSectionLayout, string> = {
  'text-left': 'grid md:grid-cols-2 gap-8 md:gap-12 items-center',
  'text-right':
    'grid md:grid-cols-2 gap-8 md:gap-12 items-center md:[&>*:first-child]:order-1 md:[&>*:last-child]:order-2',
  center: 'flex flex-col items-center text-center max-w-2xl mx-auto',
};

export interface LandingSectionProps {
  id?: string;
  /** Layout da seção: texto esq/dir/centro; extensível para seções futuras */
  layout?: LandingSectionLayout;
  /** Variante de estilo (background); mantido para compatibilidade */
  variant?: LandingSectionVariant;
  children: React.ReactNode;
  className?: string;
  /** Para seções com conteúdo centralizado (não hero) */
  narrow?: boolean;
}

export function LandingSection({
  id,
  layout,
  variant,
  children,
  className = '',
  narrow = true,
}: LandingSectionProps) {
  const base = variant ? variantClasses[variant] : '';
  const container =
    variant === 'hero'
      ? ''
      : variant === 'featured' ||
          variant === 'categories' ||
          variant === 'categories-alt' ||
          variant === 'footer'
        ? 'max-w-6xl mx-auto'
        : narrow
          ? 'max-w-2xl mx-auto'
          : '';
  const sectionCls = cn(base, className).trim();

  if (variant === 'hero') {
    return (
      <section id={id} className={sectionCls || undefined}>
        {layout ? (
          <div className={cn('max-w-6xl mx-auto px-4 sm:px-6', layoutClasses[layout])}>
            {children}
          </div>
        ) : (
          <div className="max-w-6xl mx-auto px-4 sm:px-6">{children}</div>
        )}
      </section>
    );
  }

  const useWideContainer =
    variant === 'featured' ||
    variant === 'categories' ||
    variant === 'categories-alt' ||
    variant === 'footer';
  const wrapperClass = useWideContainer ? 'max-w-6xl mx-auto' : undefined;

  return (
    <section id={id} className={sectionCls || undefined}>
      {wrapperClass ? (
        <div className={wrapperClass}>
          {layout ? <div className={layoutClasses[layout]}>{children}</div> : children}
        </div>
      ) : layout ? (
        <div className={layoutClasses[layout]}>{children}</div>
      ) : (
        <div className={container || undefined}>{children}</div>
      )}
    </section>
  );
}
