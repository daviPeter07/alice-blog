import type { LandingSectionVariant } from '@/types/landing';
import { cn } from '@/lib/utils';

export type LandingSectionLayout = 'text-left' | 'text-right' | 'center' | 'wide';

/* Vibe café: marrom mais claro (cream) e mais escuro (latte/mocha) */
const variantClasses: Record<LandingSectionVariant, string> = {
  hero: 'bg-background',
  featured:
    'bg-cafe-latte theme-dark:bg-muted/40 py-20 sm:py-28 px-6 min-h-[min(80vh,900px)] flex flex-col justify-center',
  categories:
    'bg-background py-20 sm:py-28 px-6 min-h-[min(80vh,900px)] flex flex-col justify-center',
  'categories-alt':
    'bg-cafe-mocha theme-dark:bg-muted/40 py-20 sm:py-28 px-6 min-h-[min(80vh,900px)] flex flex-col justify-center',
  footer: 'bg-background py-20 sm:py-28 px-6 min-h-[min(80vh,900px)] flex flex-col justify-center',
};

const layoutClasses: Record<LandingSectionLayout, string> = {
  'text-left': 'grid md:grid-cols-[minmax(0,320px)_1fr] gap-8 md:gap-12 md:gap-16 items-start',
  'text-right':
    'grid md:grid-cols-[1fr_minmax(0,320px)] gap-8 md:gap-12 md:gap-16 items-start md:[&>*:first-child]:order-1 md:[&>*:last-child]:order-2',
  center: 'flex flex-col items-center text-center max-w-2xl mx-auto',
  wide: 'flex flex-col max-w-6xl w-full',
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
  const layoutCls = layout && layoutClasses[layout];

  return (
    <section id={id} className={sectionCls || undefined}>
      {wrapperClass ? (
        <div className={cn(wrapperClass, 'px-4 sm:px-6')}>
          {layoutCls ? <div className={layoutCls}>{children}</div> : children}
        </div>
      ) : layoutCls ? (
        <div className={cn('max-w-6xl mx-auto px-4 sm:px-6', layoutCls)}>{children}</div>
      ) : (
        <div className={container || undefined}>{children}</div>
      )}
    </section>
  );
}
