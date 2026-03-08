import { cn } from '@/lib/utils';

const DOT_COUNT = 3;

export interface LoadingDotsProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const sizeClasses = {
  sm: 'size-1.5',
  md: 'size-2.5',
  lg: 'size-4',
};

const gapClasses = {
  sm: 'gap-1',
  md: 'gap-1.5',
  lg: 'gap-2',
};

export function LoadingDots({ className, size = 'md' }: LoadingDotsProps) {
  return (
    <div
      role="status"
      aria-label="Carregando"
      className={cn('flex items-center justify-center', gapClasses[size], className)}
    >
      {Array.from({ length: DOT_COUNT }, (_, i) => (
        <span
          key={i}
          className={cn(
            'rounded-full bg-current opacity-60',
            'animate-[bounce_0.6s_ease-in-out_infinite]',
            sizeClasses[size]
          )}
          style={{ animationDelay: `${i * 0.12}s` }}
        />
      ))}
      <span className="sr-only">Carregando...</span>
    </div>
  );
}
