'use server';

import { revalidateTag } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { createCommentSchema } from '@/lib/schemas/comment.schema';
import type { ActionResult } from '@/lib/types';

export async function createComment(
  _prevState: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  const session = await getSession();
  if (!session) {
    return { success: false, error: 'login_required' };
  }

  const raw = {
    postId: formData.get('postId'),
    parentId: formData.get('parentId') || undefined,
    authorName: formData.get('authorName'),
    authorEmail: formData.get('authorEmail'),
    body: formData.get('body'),
  };

  const parsed = createCommentSchema.safeParse({
    ...raw,
    authorName: session.name,
    authorEmail: session.email,
  });

  if (!parsed.success) {
    return {
      success: false,
      error: 'Por favor, corrija os campos destacados.',
      fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  try {
    // Só vincula authorId se o usuário ainda existir no banco (evita FK após seed/reset)
    const userExists = await prisma.user.findUnique({
      where: { id: session.userId },
      select: { id: true },
    });

    await prisma.comment.create({
      data: {
        postId: parsed.data.postId,
        parentId: parsed.data.parentId ?? undefined,
        authorName: session.name,
        authorEmail: session.email,
        ...(userExists ? { authorId: session.userId } : {}),
        body: parsed.data.body,
      },
    });
    revalidateTag(`comments:${parsed.data.postId}`, 'max');
    return { success: true, data: undefined };
  } catch {
    return {
      success: false,
      error: 'Erro ao salvar comentário. Tente novamente.',
    };
  }
}
