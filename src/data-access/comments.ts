import { cacheTag } from 'next/cache';
import { prisma } from '@/lib/prisma';
import type { CommentWithReplies } from '@/lib/types';

export async function getCommentsByPostId(postId: string): Promise<CommentWithReplies[]> {
  'use cache';

  cacheTag(`comments:${postId}`);

  const comments = await prisma.comment.findMany({
    where: { postId, parentId: null },
    include: { replies: { orderBy: { createdAt: 'asc' } } },
    orderBy: { createdAt: 'desc' },
  });

  return comments as CommentWithReplies[];
}
