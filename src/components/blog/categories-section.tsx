import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { LandingSection } from '@/components/blog/landing-section';
import type { CategoryItem } from '@/types/landing';

/** Estilo idêntico às tags dos cards de artigo (post-card) */
const TAG_BADGE_CLASS =
  'font-ui text-[11px] max-w-[120px] truncate border border-brand-green/20 bg-brand-green/5 text-foreground ' +
  'hover:border-brand-green/35 hover:bg-brand-green/8 ' +
  'theme-dark:border-brand-green-light/50 theme-dark:bg-brand-green-light/25 theme-dark:text-foreground ' +
  'theme-dark:hover:border-brand-green-light/60 theme-dark:hover:bg-brand-green-light/35 ' +
  'transition-colors';

export interface CategoryBlockProps {
  categories: CategoryItem[];
  title: string;
  subtitle?: string;
}

function CategoryBlock({ categories, title, subtitle }: CategoryBlockProps) {
  return (
    <div className="text-center">
      <h3 className="font-body text-xl font-semibold text-foreground mb-1">{title}</h3>
      {subtitle && <p className="font-ui text-sm text-muted-foreground mb-4">{subtitle}</p>}
      <div className="flex flex-wrap justify-center gap-2" role="list" aria-label={title}>
        {categories.map((cat, index) => (
          <Link
            key={cat.slug}
            href={`/blog?tag=${encodeURIComponent(cat.slug)}`}
            title={cat.label}
            className="animate-fade-up focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-md inline-flex"
            style={{ animationDelay: `${index * 30}ms` }}
            role="listitem"
          >
            <Badge variant="secondary" className={TAG_BADGE_CLASS}>
              {cat.label.length > 20 ? `${cat.label.slice(0, 18)}…` : cat.label}
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
      <LandingSection variant="categories" layout="center" id="categorias">
        <section aria-labelledby="categories-heading">
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
            <div className="rounded-2xl border border-border bg-card/50 p-8 sm:p-10 space-y-10">
              {featured.length > 0 && (
                <CategoryBlock
                  categories={featured}
                  title="Em destaque"
                  subtitle="Alguns tópicos que aparecem com frequência."
                />
              )}
              {rest.length > 0 && (
                <CategoryBlock
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
