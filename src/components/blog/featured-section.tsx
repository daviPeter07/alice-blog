import { PostCard } from '@/components/blog/post-card';
import { Pagination } from '@/components/blog/pagination';
import { LandingSection } from '@/components/blog/landing-section';
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
      <section aria-labelledby="featured-heading">
        <header className="mb-10">
          <p
            className="animate-fade-up font-ui text-xs tracking-[0.2em] uppercase text-muted-foreground mb-3 select-none"
            style={{ animationDelay: '0ms' }}
          >
            seleção
          </p>
          <h2
            id="featured-heading"
            className="animate-fade-up font-body text-3xl sm:text-4xl font-semibold text-foreground leading-tight"
            style={{ animationDelay: '60ms' }}
          >
            Em destaque
          </h2>
          <p
            className="animate-fade-up font-ui text-muted-foreground mt-2 leading-relaxed"
            style={{ animationDelay: '120ms' }}
          >
            Ordenados por curtidas.
          </p>
        </header>

        <div
          style={
            animationDelay
              ? ({ '--section-delay': `${animationDelay}ms` } as React.CSSProperties)
              : undefined
          }
        >
          {posts.length === 0 ? (
            <p className="font-ui text-muted-foreground">Nenhum artigo publicado ainda.</p>
          ) : (
            <>
              <div
                className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6"
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
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                baseUrl="/"
                searchParams={searchParams}
              />
            </>
          )}
        </div>
      </section>
    </LandingSection>
  );
}
