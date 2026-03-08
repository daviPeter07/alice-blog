import { cacheTag } from 'next/cache';
import { prisma } from '@/lib/prisma';
import type { PostWithRelations } from '@/lib/types';

export async function getPostBySlug(slug: string): Promise<PostWithRelations | null> {
  'use cache';

  cacheTag(`post:${slug}`);

  const post = await prisma.post.findUnique({
    where: { slug },
    include: {
      author: { select: { name: true, image: true, role: true } },
      comments: {
        where: { parentId: null },
        include: {
          author: { select: { role: true } },
          replies: {
            orderBy: { createdAt: 'asc' },
            include: { author: { select: { role: true } } },
          },
        },
        orderBy: { createdAt: 'desc' },
      },
      _count: { select: { likes: true } },
    },
  });

  if (!post) return null;

  cacheTag(`comments:${post.id}`);
  cacheTag(`likes:${post.id}`);

  return post as PostWithRelations;
}

export async function getPublishedPostSlugs(): Promise<{ slug: string }[]> {
  'use cache';
  cacheTag('posts:list');

  return prisma.post.findMany({
    where: { status: 'PUBLISHED' },
    select: { slug: true },
    orderBy: { publishedAt: 'desc' },
  });
}

export async function getRecentPosts(limit = 10) {
  'use cache';

  cacheTag('posts:list');

  return prisma.post.findMany({
    where: { status: 'PUBLISHED' },
    select: {
      slug: true,
      title: true,
      excerpt: true,
      publishedAt: true,
      tags: true,
      readingTime: true,
      author: { select: { name: true, image: true, role: true } },
      _count: { select: { likes: true, comments: true } },
    },
    orderBy: { publishedAt: 'desc' },
    take: limit,
  });
}

/** Busca um post por ID (para admin). Não usa cache. */
export async function getPostById(id: string) {
  return prisma.post.findUnique({
    where: { id },
    include: {
      author: { select: { name: true } },
    },
  });
}

/** Lista todos os posts para a área admin (qualquer status). Não usa cache. */
export async function getPostsForAdmin() {
  return prisma.post.findMany({
    orderBy: { updatedAt: 'desc' },
    include: {
      author: { select: { name: true } },
      _count: { select: { comments: true, likes: true } },
    },
  });
}
