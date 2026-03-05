import { cacheTag } from "next/cache";
import { prisma } from "@/lib/prisma";
import type { PostWithRelations } from "@/lib/types";

export async function getPostBySlug(
  slug: string,
): Promise<PostWithRelations | null> {
  "use cache";

  cacheTag(`post:${slug}`);

  const post = await prisma.post.findUnique({
    where: { slug },
    include: {
      author: { select: { name: true, image: true } },
      comments: {
        where: { parentId: null },
        include: { replies: true },
        orderBy: { createdAt: "desc" },
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
  "use cache";
  cacheTag("posts:list");

  return prisma.post.findMany({
    where: { status: "PUBLISHED" },
    select: { slug: true },
    orderBy: { publishedAt: "desc" },
  });
}

export async function getRecentPosts(limit = 10) {
  "use cache";

  cacheTag("posts:list");

  return prisma.post.findMany({
    where: { status: "PUBLISHED" },
    select: {
      slug: true,
      title: true,
      excerpt: true,
      publishedAt: true,
      tags: true,
      readingTime: true,
      author: { select: { name: true, image: true } },
      _count: { select: { likes: true, comments: true } },
    },
    orderBy: { publishedAt: "desc" },
    take: limit,
  });
}
