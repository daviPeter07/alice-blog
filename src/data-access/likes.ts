import { cacheTag } from 'next/cache';
import { prisma } from '@/lib/prisma';

/**
 * Verifica se o post foi curtido pelo usuário/identificador dado.
 * O parâmetro `fingerprint` aceita tanto browser fingerprint (anon) quanto
 * session.userId quando o usuário está autenticado (coluna do banco é fingerprint).
 */
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
