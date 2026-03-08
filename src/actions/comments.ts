'use server';

import { revalidateTag } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { createCommentSchema } from '@/lib/schemas/comment.schema';
import type { ActionResult } from '@/lib/types';

const EDIT_WINDOW_MS = 5 * 60 * 1000; // 5 minutos

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

export async function deleteComment(
  _prevState: ActionResult | null,
  payload: { commentId: string; postId: string }
): Promise<ActionResult> {
  const session = await getSession();
  if (!session) {
    return { success: false, error: 'login_required' };
  }

  const comment = await prisma.comment.findUnique({
    where: { id: payload.commentId, postId: payload.postId },
    select: { id: true, authorEmail: true, authorId: true },
  });

  if (!comment) {
    return { success: false, error: 'Comentário não encontrado.' };
  }

  const isOwner =
    comment.authorId === session.userId || comment.authorEmail === session.email;
  if (!isOwner) {
    return { success: false, error: 'Você não pode excluir este comentário.' };
  }

  try {
    await prisma.comment.delete({ where: { id: payload.commentId } });
    revalidateTag(`comments:${payload.postId}`, 'max');
    return { success: true, data: undefined };
  } catch {
    return { success: false, error: 'Erro ao excluir comentário. Tente novamente.' };
  }
}

export async function updateComment(
  _prevState: ActionResult | null,
  payload: { commentId: string; postId: string; body: string }
): Promise<ActionResult> {
  const session = await getSession();
  if (!session) {
    return { success: false, error: 'login_required' };
  }

  const body = payload.body?.trim();
  if (!body || body.length < 3) {
    return { success: false, error: 'O comentário deve ter pelo menos 3 caracteres.' };
  }
  if (body.length > 5000) {
    return { success: false, error: 'O comentário deve ter no máximo 5.000 caracteres.' };
  }

  const comment = await prisma.comment.findUnique({
    where: { id: payload.commentId, postId: payload.postId },
    select: { id: true, authorEmail: true, authorId: true, createdAt: true },
  });

  if (!comment) {
    return { success: false, error: 'Comentário não encontrado.' };
  }

  const isOwner =
    comment.authorId === session.userId || comment.authorEmail === session.email;
  if (!isOwner) {
    return { success: false, error: 'Você não pode editar este comentário.' };
  }

  const elapsed = Date.now() - new Date(comment.createdAt).getTime();
  if (elapsed > EDIT_WINDOW_MS) {
    return { success: false, error: 'Só é possível editar até 5 minutos após publicar.' };
  }

  try {
    await prisma.comment.update({
      where: { id: payload.commentId },
      data: { body },
    });
    revalidateTag(`comments:${payload.postId}`, 'max');
    return { success: true, data: undefined };
  } catch {
    return { success: false, error: 'Erro ao salvar edição. Tente novamente.' };
  }
}
