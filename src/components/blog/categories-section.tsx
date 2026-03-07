import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import type { CategoryItem } from '@/types/landing';

export interface CategoriesSectionProps {
  categories: CategoryItem[];
  /** Atraso em ms para animação de entrada */
  animationDelay?: number;
}

export function CategoriesSection({ categories, animationDelay = 0 }: CategoriesSectionProps) {
  return (
    <section
      id="categorias"
      className="py-16 px-6 bg-muted/40"
      aria-labelledby="categories-heading"
    >
      <div className="max-w-2xl mx-auto">
        <header className="mb-10">
          <p
            className="animate-fade-up font-ui text-xs tracking-[0.2em] uppercase text-muted-foreground mb-3 select-none"
            style={{ animationDelay: '0ms' }}
          >
            explore
          </p>
          <h2
            id="categories-heading"
            className="animate-fade-up font-body text-3xl sm:text-4xl font-semibold text-foreground leading-tight"
            style={{ animationDelay: '60ms' }}
          >
            Explore categorias
          </h2>
          <p
            className="animate-fade-up font-ui text-muted-foreground mt-2 leading-relaxed"
            style={{ animationDelay: '120ms' }}
          >
            Temas e assuntos que percorrem os artigos.
          </p>
        </header>

        {categories.length === 0 ? (
          <p className="font-ui text-muted-foreground">Nenhuma categoria ainda.</p>
        ) : (
          <div className="flex flex-wrap gap-2" role="list" aria-label="Categorias e tags">
            {categories.map((cat, index) => (
              <Link
                key={cat.slug}
                href={`/blog?tag=${encodeURIComponent(cat.slug)}`}
                className="animate-fade-up focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-md"
                style={{ animationDelay: `${180 + index * 40}ms` }}
                role="listitem"
              >
                <Badge
                  variant="secondary"
                  className="font-ui text-sm py-1.5 px-3 hover:bg-brand-green/10 hover:text-brand-green transition-colors"
                >
                  {cat.label}
                </Badge>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
