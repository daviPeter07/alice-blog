import { cacheTag } from 'next/cache';
import { prisma } from '@/lib/prisma';

export async function getLikeByPostAndFingerprint(
  postId: string,
  fingerprint: string
): Promise<boolean> {
  'use cache';
  cacheTag(`likes:${postId}`);

  const like = await prisma.like.findUnique({
    where: { postId_fingerprint: { postId, fingerprint } },
  });
  return like !== null;
}
