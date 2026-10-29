import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Feather } from 'lucide-react';
import { PostCard } from '@/components/blog/post-card';
import { Pagination } from '@/components/blog/pagination';
import { LandingSection } from '@/components/blog/landing-section';
import { SectionHeader } from '@/components/blog/section-header';
import type { PostPreview } from '@/types/landing';

export interface FeaturedSectionProps {
  posts: PostPreview[];
  animationDelay?: number;
  currentPage?: number;
  totalPages?: number;
  searchParams?: Record<string, string>;
}

export function FeaturedSection({
  posts,
  animationDelay = 0,
  currentPage = 1,
  totalPages = 1,
  searchParams,
}: FeaturedSectionProps) {
  return (
    <LandingSection variant="featured" id="destaque">
      <section aria-labelledby="featured-heading" className="relative">
        <Image
          src="/gato-lendo-removebg-preview.png"
          alt=""
          width={220}
          height={220}
          className="pointer-events-none absolute theme-dark:drop-shadow-[0_0_10px_rgba(255,255,255,0.55)] -top-24 right-0 w-48 hidden select-none lg:block reveal-item reveal-delay-4"
          aria-hidden
        />

        <SectionHeader
          id="featured-heading"
          eyebrow="seleção"
          title="Em destaque"
          description={
            <>
              Os textos mais curtidos aparecem primeiro.
              {posts.length > 0 && (
                <span className="mt-1 block text-sm text-muted-foreground/80">
                  {posts.length} {posts.length === 1 ? 'artigo' : 'artigos'} nesta página ·
                  ordenados por curtidas
                </span>
              )}
            </>
          }
          action={
            <Link
              href="/blog"
              className="group inline-flex items-center gap-2 rounded-full border border-brand-green/30 bg-card px-5 py-2.5 font-ui text-sm font-semibold text-brand-green shadow-sm transition-all hover:border-brand-green hover:bg-brand-green hover:text-white theme-dark:text-foreground"
            >
              Ver blog completo
              <ArrowRight
                className="size-4 transition-transform group-hover:translate-x-0.5"
                aria-hidden
              />
            </Link>
          }
          className="lg:pr-40"
        />

        <div
          style={
            animationDelay
              ? ({ '--section-delay': `${animationDelay}ms` } as React.CSSProperties)
              : undefined
          }
        >
          {posts.length === 0 ? (
            <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-brand-brown/25 bg-card/60 px-6 py-16 text-center">
              <Feather className="size-8 text-brand-brown-light" strokeWidth={1.5} aria-hidden />
              <p className="font-heading text-lg font-semibold text-foreground">
                Nenhum artigo publicado ainda
              </p>
              <p className="font-ui text-sm text-muted-foreground">
                Os primeiros textos estão sendo escritos. Volte em breve!
              </p>
            </div>
          ) : (
            <>
              <div
                className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
                aria-label="Lista de artigos em destaque"
              >
                {posts.map((post, index) => (
                  <PostCard
                    key={post.slug}
                    slug={post.slug}
                    title={post.title}
                    excerpt={post.excerpt ?? ''}
                    publishedAt={post.publishedAt}
                    tags={post.tags}
                    readingTime={post.readingTime}
                    author={post.author}
                    likesCount={post._count.likes}
                    commentsCount={post._count.comments}
                    index={index}
                  />
                ))}
              </div>
              {totalPages > 1 && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  baseUrl="/"
                  searchParams={searchParams}
                />
              )}
            </>
          )}
        </div>
      </section>
    </LandingSection>
  );
}
