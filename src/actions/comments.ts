'use server';

import { revalidateTag } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import {
  commentRefSchema,
  createCommentSchema,
  updateCommentSchema,
} from '@/lib/schemas/comment.schema';
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

  const { postId, parentId } = parsed.data;
  const post = await prisma.post.findUnique({ where: { id: postId }, select: { status: true } });
  if (!post || post.status !== 'PUBLISHED') {
    return { success: false, error: 'Post não encontrado.' };
  }
  if (parentId) {
    // Respostas têm um nível só e precisam ser do mesmo post
    const parent = await prisma.comment.findUnique({
      where: { id: parentId },
      select: { postId: true, parentId: true },
    });
    if (!parent || parent.postId !== postId || parent.parentId !== null) {
      return { success: false, error: 'Comentário respondido não encontrado.' };
    }
  }

  try {
    // Só vincula authorId se o usuário ainda existir no banco (evita FK após seed/reset)
    const userExists = await prisma.user.findUnique({
      where: { id: session.userId },
      select: { id: true },
    });

    await prisma.comment.create({
      data: {
        postId,
        parentId,
        authorName: session.name,
        authorEmail: session.email,
        ...(userExists ? { authorId: session.userId } : {}),
        body: parsed.data.body,
      },
    });
    revalidateTag(`comments:${postId}`, 'max');
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

  const parsed = commentRefSchema.safeParse(payload);
  if (!parsed.success) {
    return { success: false, error: 'Comentário inválido.' };
  }
  const { commentId, postId } = parsed.data;

  const comment = await prisma.comment.findUnique({
    where: { id: commentId, postId },
    select: { id: true, authorEmail: true, authorId: true },
  });

  if (!comment) {
    return { success: false, error: 'Comentário não encontrado.' };
  }

  const isOwner = comment.authorId === session.userId || comment.authorEmail === session.email;
  if (!isOwner) {
    return { success: false, error: 'Você não pode excluir este comentário.' };
  }

  try {
    await prisma.comment.delete({ where: { id: commentId } });
    revalidateTag(`comments:${postId}`, 'max');
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

  const parsed = updateCommentSchema.safeParse(payload);
  if (!parsed.success) {
    const msg = parsed.error.issues[0]?.message ?? 'Comentário inválido.';
    return { success: false, error: msg };
  }
  const { commentId, postId, body } = parsed.data;

  const comment = await prisma.comment.findUnique({
    where: { id: commentId, postId },
    select: { id: true, authorEmail: true, authorId: true, createdAt: true },
  });

  if (!comment) {
    return { success: false, error: 'Comentário não encontrado.' };
  }

  const isOwner = comment.authorId === session.userId || comment.authorEmail === session.email;
  if (!isOwner) {
    return { success: false, error: 'Você não pode editar este comentário.' };
  }

  const elapsed = Date.now() - new Date(comment.createdAt).getTime();
  if (elapsed > EDIT_WINDOW_MS) {
    return { success: false, error: 'Só é possível editar até 5 minutos após publicar.' };
  }

  try {
    await prisma.comment.update({
      where: { id: commentId },
      data: { body },
    });
    revalidateTag(`comments:${postId}`, 'max');
    return { success: true, data: undefined };
  } catch {
    return { success: false, error: 'Erro ao salvar edição. Tente novamente.' };
  }
}
