'use server';

import { revalidateTag } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { toggleLikeSchema } from '@/lib/schemas/like.schema';
import type { ActionResult } from '@/lib/types';

export async function toggleLike(
  _prevState: ActionResult<{ count: number; liked: boolean }> | null,
  formData: FormData
): Promise<ActionResult<{ count: number; liked: boolean }>> {
  const session = await getSession();
  if (!session) {
    return { success: false, error: 'login_required' };
  }

  const raw = { postId: formData.get('postId') };
  const parsed = toggleLikeSchema.safeParse(raw);
  if (!parsed.success) {
    return { success: false, error: 'Post inválido.' };
  }

  const { postId } = parsed.data;
  const fingerprint = session.userId;

  try {
    const existing = await prisma.like.findUnique({
      where: { postId_fingerprint: { postId, fingerprint } },
    });

    if (existing) {
      await prisma.like.delete({ where: { id: existing.id } });
      revalidateTag(`likes:${postId}`, 'max');
      revalidateTag('posts:list', 'max');
      const count = await prisma.like.count({ where: { postId } });
      return { success: true, data: { count, liked: false } };
    }

    await prisma.like.create({
      data: { postId, fingerprint },
    });
    revalidateTag(`likes:${postId}`, 'max');
    revalidateTag('posts:list', 'max');
    const count = await prisma.like.count({ where: { postId } });
    return { success: true, data: { count, liked: true } };
  } catch {
    return { success: false, error: 'Erro ao curtir. Tente novamente.' };
  }
}
