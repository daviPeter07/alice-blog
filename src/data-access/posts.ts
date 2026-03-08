import { cacheTag } from 'next/cache';
import { prisma } from '@/lib/prisma';
import type { PostWithRelations } from '@/lib/types';
import { computeReadingTime } from '@/helpers';

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

  const rows = await prisma.post.findMany({
    where: { status: 'PUBLISHED' },
    select: {
      slug: true,
      title: true,
      excerpt: true,
      content: true,
      publishedAt: true,
      tags: true,
      readingTime: true,
      author: { select: { name: true, image: true, role: true } },
      _count: { select: { likes: true, comments: true } },
    },
    orderBy: { publishedAt: 'desc' },
    take: limit,
  });

  return rows.map(({ content, readingTime, ...post }) => ({
    ...post,
    readingTime: readingTime ?? computeReadingTime(content ?? ''),
  }));
}

/** Lista posts paginados (backend). 12 por página (3 colunas × 4 linhas). */
export async function getPostsPaginated(
  page: number,
  perPage: number,
  tag?: string
): Promise<{
  posts: Awaited<ReturnType<typeof getRecentPosts>>;
  total: number;
  totalPages: number;
  currentPage: number;
}> {
  'use cache';

  cacheTag('posts:list');

  const where =
    tag && tag.trim()
      ? { status: 'PUBLISHED' as const, tags: { has: tag.trim() } }
      : { status: 'PUBLISHED' as const };

  const [rawPosts, total] = await Promise.all([
    prisma.post.findMany({
      where,
      select: {
        slug: true,
        title: true,
        excerpt: true,
        content: true,
        publishedAt: true,
        tags: true,
        readingTime: true,
        author: { select: { name: true, image: true, role: true } },
        _count: { select: { likes: true, comments: true } },
      },
      orderBy: { publishedAt: 'desc' },
      skip: (page - 1) * perPage,
      take: perPage,
    }),
    prisma.post.count({ where }),
  ]);

  const posts = rawPosts.map(({ content, readingTime, ...post }) => ({
    ...post,
    readingTime: readingTime ?? computeReadingTime(content ?? ''),
  }));

  const totalPages = Math.max(1, Math.ceil(total / perPage));
  const currentPage = Math.max(1, Math.min(page, totalPages));

  return {
    posts: posts as Awaited<ReturnType<typeof getRecentPosts>>,
    total,
    totalPages,
    currentPage,
  };
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
