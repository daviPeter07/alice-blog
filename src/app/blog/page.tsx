import { Suspense } from 'react';
import type { Metadata } from 'next';
import { getPostsPaginated } from '@/data-access/posts';
import { PostCard } from '@/components/blog/post-card';
import { Pagination } from '@/components/blog/pagination';

const PER_PAGE = 12; // 3 colunas × 4 linhas

export const metadata: Metadata = {
  title: 'Artigos',
  description: 'Ensaios sobre filosofia, história, crítica social e a condição humana.',
};

interface BlogPageProps {
  searchParams: Promise<{ page?: string; tag?: string }>;
}

async function BlogContent({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; tag?: string }>;
}) {
  const { page: pageParam, tag } = await searchParams;
  const page = Math.max(1, parseInt(pageParam ?? '1', 10) || 1);
  const { posts, totalPages, currentPage } = await getPostsPaginated(page, PER_PAGE, tag);
  const searchParamsForUrl = tag ? { tag } : undefined;

  if (posts.length === 0) {
    return <p className="font-ui text-muted-foreground">Nenhum artigo publicado ainda.</p>;
  }

  return (
    <>
      <section
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6"
        aria-label="Lista de artigos"
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
      </section>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        baseUrl="/blog"
        searchParams={searchParamsForUrl}
      />
    </>
  );
}

function BlogFallback() {
  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="animate-pulse rounded-2xl border border-border bg-card h-56" />
      ))}
    </section>
  );
}

export default function BlogPage({ searchParams }: BlogPageProps) {
  return (
    <main className="max-w-6xl mx-auto px-6 py-16">
      <header className="mb-14">
        <p
          className="animate-fade-up font-ui text-xs tracking-[0.2em] uppercase text-muted-foreground mb-3 select-none"
          style={{ animationDelay: '0ms' }}
        >
          por Alice
        </p>
        <h1
          className="animate-fade-up font-body text-5xl font-semibold text-foreground mb-4 leading-tight"
          style={{ animationDelay: '60ms' }}
        >
          Artigos
        </h1>
        <p
          className="animate-fade-up font-ui text-muted-foreground text-lg leading-relaxed max-w-sm"
          style={{ animationDelay: '120ms' }}
        >
          Ensaios sobre filosofia, história, crítica social e a condição humana.
        </p>
      </header>

      <Suspense fallback={<BlogFallback />}>
        <BlogContent searchParams={searchParams} />
      </Suspense>
    </main>
  );
}
