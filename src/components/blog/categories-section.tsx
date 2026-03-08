import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { LandingSection } from '@/components/blog/landing-section';
import type { CategoryItem } from '@/types/landing';

export interface CategoryPillBlockProps {
  categories: CategoryItem[];
  title: string;
  subtitle?: string;
  /** Estilo: pills com hover verde ou marrom */
  accent?: 'green' | 'brown';
}

export function CategoryPillBlock({
  categories,
  title,
  subtitle,
  accent = 'green',
}: CategoryPillBlockProps) {
  const hoverClass =
    accent === 'brown'
      ? 'hover:bg-brand-brown/10 hover:text-brand-brown'
      : 'hover:bg-brand-green/10 hover:text-brand-green';

  return (
    <div>
      <h3 className="font-body text-xl font-semibold text-foreground mb-1">{title}</h3>
      {subtitle && <p className="font-ui text-sm text-muted-foreground mb-4">{subtitle}</p>}
      <div className="flex flex-wrap gap-2" role="list" aria-label={title}>
        {categories.map((cat, index) => (
          <Link
            key={cat.slug}
            href={`/blog?tag=${encodeURIComponent(cat.slug)}`}
            className={`animate-fade-up font-ui text-sm py-1.5 px-3 rounded-md border border-border bg-card/80 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${hoverClass}`}
            style={{ animationDelay: `${index * 40}ms` }}
            role="listitem"
          >
            {cat.label}
          </Link>
        ))}
      </div>
    </div>
  );
}

export interface CategoryBadgeBlockProps {
  categories: CategoryItem[];
  title: string;
  subtitle?: string;
}

export function CategoryBadgeBlock({ categories, title, subtitle }: CategoryBadgeBlockProps) {
  return (
    <div>
      <h3 className="font-body text-xl font-semibold text-foreground mb-1">{title}</h3>
      {subtitle && <p className="font-ui text-sm text-muted-foreground mb-4">{subtitle}</p>}
      <div className="flex flex-wrap gap-2" role="list" aria-label={title}>
        {categories.map((cat, index) => (
          <Link
            key={cat.slug}
            href={`/blog?tag=${encodeURIComponent(cat.slug)}`}
            className="animate-fade-up focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-md"
            style={{ animationDelay: `${index * 30}ms` }}
            role="listitem"
          >
            <Badge
              variant="secondary"
              className="font-ui text-sm py-1.5 px-3 hover:bg-brand-brown/10 hover:text-brand-brown transition-colors"
            >
              {cat.label}
            </Badge>
          </Link>
        ))}
      </div>
    </div>
  );
}

export interface CategoriesSectionProps {
  categories: CategoryItem[];
  /** Quantos tópicos mostrar no bloco "em destaque" (primeiros N); resto vai em "Todos os temas" */
  featuredCount?: number;
  animationDelay?: number;
}

export function CategoriesSection({ categories, featuredCount = 4 }: CategoriesSectionProps) {
  const featured = categories.slice(0, featuredCount);
  const rest = categories.slice(featuredCount);

  return (
    <>
      <LandingSection variant="categories">
        <section id="categorias" aria-labelledby="categories-heading">
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
              Temas e assuntos
            </h2>
            <p
              className="animate-fade-up font-ui text-muted-foreground mt-2 leading-relaxed"
              style={{ animationDelay: '120ms' }}
            >
              Navegue por tópicos que aparecem nos textos.
            </p>
          </header>

          {categories.length === 0 ? (
            <p className="font-ui text-muted-foreground">Nenhuma categoria ainda.</p>
          ) : (
            <div className="space-y-10">
              {featured.length > 0 && (
                <CategoryPillBlock
                  categories={featured}
                  title="Em destaque"
                  subtitle="Alguns tópicos que aparecem com frequência."
                  accent="green"
                />
              )}
              {rest.length > 0 && (
                <CategoryBadgeBlock
                  categories={rest}
                  title="Todos os temas"
                  subtitle="Lista completa para filtrar no blog."
                />
              )}
            </div>
          )}
        </section>
      </LandingSection>
    </>
  );
}
