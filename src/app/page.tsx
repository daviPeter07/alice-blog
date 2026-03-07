import { Suspense } from 'react';
import { getRecentPosts } from '@/data-access/posts';
import { HeroSection } from '@/components/blog/hero-section';
import { FeaturedSection } from '@/components/blog/featured-section';
import { CategoriesSection } from '@/components/blog/categories-section';
import { BackToTop } from '@/components/ui/back-to-top';
import type { CategoryItem } from '@/types/landing';

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

export default async function HomePage() {
  const posts = await getRecentPosts(6);
  const categories = getCategoriesFromPosts(posts);

  return (
    <main className="flex flex-col min-h-[calc(100vh-3.5rem)]">
      <HeroSection />
      <FeaturedSection posts={posts} />
      <CategoriesSection categories={categories} />
      <BackToTop threshold={400} />
    </main>
  );
}
