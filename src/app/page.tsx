import { Suspense } from 'react';
import { getRecentPosts, getPostsPaginated } from '@/data-access/posts';
import { HeroSection } from '@/components/blog/hero-section';
import { FeaturedSection } from '@/components/blog/featured-section';
import { QuemSouEuSection } from '@/components/blog/quem-sou-eu-section';
import { CategoriesSection } from '@/components/blog/categories-section';
import { PersonalizarSection } from '@/components/blog/personalizar-section';
import { ComoFuncionaSection } from '@/components/blog/como-funciona-section';
import { RevealSectionWrapper } from '@/components/blog/reveal-section-wrapper';
import { BackToTop } from '@/components/ui/back-to-top';
import { LoadingDots } from '@/components/ui/loading-dots';
import type { CategoryItem } from '@/types/landing';

const PER_PAGE = 12; // 3 colunas × 4 linhas

function getCategoriesFromPosts(posts: Awaited<ReturnType<typeof getRecentPosts>>): CategoryItem[] {
  const tagSet = new Set<string>();
  for (const post of posts) {
    for (const tag of post.tags) {
      if (tag.trim()) tagSet.add(tag.trim());
    }
  }
  return Array.from(tagSet)
    .sort((a, b) => a.localeCompare(b, 'pt-BR'))
    .map((label) => ({ slug: label, label }));
}

async function FeaturedContent({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  const { page: pageParam } = await searchParams;
  const page = Math.max(1, parseInt(pageParam ?? '1', 10) || 1);
  const { posts, totalPages, currentPage } = await getPostsPaginated(page, PER_PAGE);

  return (
    <FeaturedSection
      posts={posts}
      currentPage={currentPage}
      totalPages={totalPages}
      searchParams={undefined}
    />
  );
}

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const postsForCategories = await getRecentPosts(50);
  const categories = getCategoriesFromPosts(postsForCategories);

  return (
    <main className="flex flex-col min-h-[calc(100vh-3.5rem)]">
      <HeroSection />
      <RevealSectionWrapper>
        <Suspense
          fallback={
            <div className="min-h-[400px] flex items-center justify-center text-muted-foreground">
              <LoadingDots size="lg" />
            </div>
          }
        >
          <FeaturedContent searchParams={searchParams} />
        </Suspense>
      </RevealSectionWrapper>
      <RevealSectionWrapper>
        <QuemSouEuSection />
      </RevealSectionWrapper>
      <RevealSectionWrapper>
        <CategoriesSection categories={categories} />
      </RevealSectionWrapper>
      <RevealSectionWrapper>
        <PersonalizarSection />
      </RevealSectionWrapper>
      <RevealSectionWrapper>
        <ComoFuncionaSection />
      </RevealSectionWrapper>
      <BackToTop threshold={400} />
    </main>
  );
}
