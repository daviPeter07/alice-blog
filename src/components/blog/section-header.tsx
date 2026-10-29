import { cn } from '@/lib/utils';

export interface SectionHeaderProps {
  id: string;
  eyebrow: string;
  title: string;
  description?: React.ReactNode;
  align?: 'left' | 'center';
  /** Conteúdo à direita do título (ex.: link "ver todos") — só no alinhamento à esquerda */
  action?: React.ReactNode;
  className?: string;
}

export function SectionHeader({
  id,
  eyebrow,
  title,
  description,
  align = 'left',
  action,
  className,
}: SectionHeaderProps) {
  const centered = align === 'center';

  return (
    <header
      className={cn(
        'mb-12 flex flex-col gap-6',
        centered ? 'items-center text-center' : 'md:flex-row md:items-end md:justify-between',
        className
      )}
    >
      <div className={cn('max-w-2xl', centered && 'flex flex-col items-center')}>
        <p className="reveal-item reveal-delay-0 mb-4 inline-flex items-center gap-3 font-ui text-xs font-bold uppercase tracking-[0.25em] text-brand-brown-light select-none">
          <span className="h-px w-8 bg-brand-brown-light/60" aria-hidden />
          {eyebrow}
          {centered && <span className="h-px w-8 bg-brand-brown-light/60" aria-hidden />}
        </p>
        <h2
          id={id}
          className="reveal-item reveal-delay-1 font-heading text-3xl font-semibold leading-tight text-foreground sm:text-4xl"
        >
          {title}
        </h2>
        {description && (
          <div className="reveal-item reveal-delay-2 mt-4 font-ui text-base leading-relaxed text-muted-foreground">
            {description}
          </div>
        )}
      </div>
      {action && !centered && <div className="reveal-item reveal-delay-3 shrink-0">{action}</div>}
    </header>
  );
}
