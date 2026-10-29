import Link from 'next/link';
import Image from 'next/image';
import { ArrowUpRight, Hash } from 'lucide-react';
import { LandingSection } from '@/components/blog/landing-section';
import { SectionHeader } from '@/components/blog/section-header';
import type { CategoryItem } from '@/types/landing';

const truncateLabel = (label: string) => (label.length > 24 ? `${label.slice(0, 22)}…` : label);

const tagHref = (slug: string) => `/blog?tag=${encodeURIComponent(slug)}`;

function FeaturedCategoryCard({ category, index }: { category: CategoryItem; index: number }) {
  return (
    <Link
      href={tagHref(category.slug)}
      title={category.label}
      role="listitem"
      className={`reveal-item ${index % 2 === 0 ? 'reveal-from-left' : 'reveal-from-right'} reveal-delay-${Math.min(index + 3, 11)} group relative flex flex-col justify-between gap-6 overflow-hidden rounded-2xl border border-border bg-card p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-brand-green/40 hover:shadow-[0_12px_32px_-12px_rgba(27,48,34,0.3)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring`}
    >
      <div className="flex items-start justify-between gap-3">
        <span className="flex size-9 items-center justify-center rounded-xl bg-brand-green/10 text-brand-green theme-dark:bg-brand-green-light/20 theme-dark:text-foreground">
          <Hash className="size-4" aria-hidden />
        </span>
        <ArrowUpRight
          className="size-4 text-muted-foreground transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-brand-green"
          aria-hidden
        />
      </div>
      <div className="min-w-0">
        <p className="truncate font-heading text-lg font-semibold text-foreground">
          {truncateLabel(category.label)}
        </p>
        {category.count !== undefined && (
          <p className="font-ui text-xs text-muted-foreground">
            {category.count} {category.count === 1 ? 'artigo' : 'artigos'}
          </p>
        )}
      </div>
    </Link>
  );
}

export interface CategoriesSectionProps {
  categories: CategoryItem[];
  /** Quantos tópicos mostrar como cartões em destaque (primeiros N); o resto vira lista de chips */
  featuredCount?: number;
  animationDelay?: number;
}

export function CategoriesSection({ categories, featuredCount = 4 }: CategoriesSectionProps) {
  const featured = categories.slice(0, featuredCount);
  const rest = [...categories.slice(featuredCount)].sort((a, b) =>
    a.label.localeCompare(b.label, 'pt-BR')
  );

  return (
    <LandingSection variant="categories-alt" layout="wide" id="categorias">
      <section aria-labelledby="categories-heading" className="relative flex w-full flex-col">
        <Image
          src="/gato-computador-removebg-preview.png"
          alt=""
          width={220}
          height={220}
          className="pointer-events-none absolute theme-dark:drop-shadow-[0_0_10px_rgba(255,255,255,0.55)] -top-20 -right-4 w-52 hidden select-none lg:block reveal-item reveal-delay-4"
          aria-hidden
        />

        <SectionHeader
          id="categories-heading"
          eyebrow="explore"
          title="Temas e assuntos"
          description="Navegue pelos tópicos que aparecem nos textos. Clique em um tema para ver os artigos dele."
          className="lg:pr-44"
        />

        {categories.length === 0 ? (
          <p className="font-ui text-muted-foreground">Nenhuma categoria ainda.</p>
        ) : (
          <div className="space-y-10">
            <div
              className="grid grid-cols-2 gap-4 md:grid-cols-4"
              role="list"
              aria-label="Temas mais frequentes"
            >
              {featured.map((cat, index) => (
                <FeaturedCategoryCard key={cat.slug} category={cat} index={index} />
              ))}
            </div>

            {rest.length > 0 && (
              <div className="reveal-item reveal-delay-6">
                <h3 className="mb-4 font-ui text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">
                  Todos os temas
                </h3>
                <div className="flex flex-wrap gap-2" role="list" aria-label="Todos os temas">
                  {rest.map((cat) => (
                    <Link
                      key={cat.slug}
                      href={tagHref(cat.slug)}
                      title={cat.label}
                      role="listitem"
                      className="inline-flex items-center gap-1.5 rounded-full border border-brand-green/20 bg-card px-3.5 py-1.5 font-ui text-sm text-foreground transition-colors hover:border-brand-green hover:bg-brand-green hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring theme-dark:border-brand-green-light/40"
                    >
                      {truncateLabel(cat.label)}
                      {cat.count !== undefined && (
                        <span className="text-xs opacity-60">{cat.count}</span>
                      )}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </section>
    </LandingSection>
  );
}
