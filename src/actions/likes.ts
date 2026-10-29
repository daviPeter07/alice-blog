'use server';

import { revalidateTag } from 'next/cache';
import { isUniqueViolation, prisma } from '@/lib/prisma';
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
    // Apaga direto em vez de buscar antes: dois cliques rápidos não disputam o mesmo registro
    const { count: removed } = await prisma.like.deleteMany({ where: { postId, fingerprint } });
    if (removed === 0) {
      try {
        await prisma.like.create({ data: { postId, fingerprint } });
      } catch (error) {
        // Outra requisição criou o like no meio tempo: o resultado já é "curtido"
        if (!isUniqueViolation(error)) throw error;
      }
    }
    revalidateTag(`likes:${postId}`, 'max');
    revalidateTag('posts:list', 'max');
    const count = await prisma.like.count({ where: { postId } });
    return { success: true, data: { count, liked: removed === 0 } };
  } catch {
    return { success: false, error: 'Erro ao curtir. Tente novamente.' };
  }
}
