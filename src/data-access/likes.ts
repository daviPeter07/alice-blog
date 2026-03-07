import { prisma } from '@/lib/prisma';

export async function getLikeByPostAndFingerprint(
  postId: string,
  fingerprint: string
): Promise<boolean> {
  const like = await prisma.like.findUnique({
    where: { postId_fingerprint: { postId, fingerprint } },
  });
  return like !== null;
}
