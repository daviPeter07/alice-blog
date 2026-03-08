'use server';

import { revalidateTag } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { createPostSchema, updatePostSchema, postIdSchema } from '@/lib/schemas/post.schema';
import type { ActionResult } from '@/lib/types';
import type { Post } from '@/lib/prisma';

export async function createPost(
  _prev: ActionResult<Post> | null,
  formData: FormData
): Promise<ActionResult<Post>> {
  const session = await getSession().catch(() => null);
  if (!session || session.role !== 'ADMIN') {
    return { success: false, error: 'Acesso restrito a administradores.' };
  }

  const raw = {
    title: formData.get('title'),
    slug: formData.get('slug'),
    excerpt: formData.get('excerpt') ?? '',
    content: formData.get('content'),
    tags: formData.get('tags') ?? '',
    status: formData.get('status') ?? 'DRAFT',
  };
  const parsed = createPostSchema.safeParse(raw);
  if (!parsed.success) {
    const first = parsed.error.flatten().fieldErrors;
    const msg = Object.values(first)[0]?.[0] ?? 'Dados inválidos.';
    return { success: false, error: msg };
  }

  const { title, slug, excerpt, content, tags, status } = parsed.data;
  try {
    const existing = await prisma.post.findUnique({ where: { slug } });
    if (existing) {
      return { success: false, error: 'Já existe um post com este slug.' };
    }
    const post = await prisma.post.create({
      data: {
        title,
        slug,
        excerpt,
        content,
        tags,
        status,
        authorId: session.userId,
        publishedAt: status === 'PUBLISHED' ? new Date() : null,
      },
    });
    revalidateTag('posts:list', 'max');
    revalidateTag(`post:${slug}`, 'max');
    return { success: true, data: post };
  } catch {
    return { success: false, error: 'Erro ao criar post. Tente novamente.' };
  }
}

export async function updatePost(
  _prev: ActionResult<Post> | null,
  formData: FormData
): Promise<ActionResult<Post>> {
  const session = await getSession().catch(() => null);
  if (!session || session.role !== 'ADMIN') {
    return { success: false, error: 'Acesso restrito a administradores.' };
  }

  const id = formData.get('id');
  const idParsed = postIdSchema.safeParse({ id });
  if (!idParsed.success) {
    return { success: false, error: 'ID do post inválido.' };
  }

  const raw = {
    id: idParsed.data.id,
    title: formData.get('title'),
    slug: formData.get('slug'),
    excerpt: formData.get('excerpt') ?? '',
    content: formData.get('content'),
    tags: formData.get('tags') ?? '',
    status: formData.get('status') ?? 'DRAFT',
  };
  const parsed = updatePostSchema.safeParse(raw);
  if (!parsed.success) {
    const first = parsed.error.flatten().fieldErrors;
    const msg = Object.values(first)[0]?.[0] ?? 'Dados inválidos.';
    return { success: false, error: msg };
  }

  const { id: postId, title, slug, excerpt, content, tags, status } = parsed.data;
  try {
    const existing = await prisma.post.findUnique({ where: { id: postId } });
    if (!existing) {
      return { success: false, error: 'Post não encontrado.' };
    }
    if (existing.slug !== slug) {
      const slugTaken = await prisma.post.findUnique({ where: { slug } });
      if (slugTaken) {
        return { success: false, error: 'Já existe um post com este slug.' };
      }
    }
    const post = await prisma.post.update({
      where: { id: postId },
      data: {
        title,
        slug,
        excerpt,
        content,
        tags,
        status,
        publishedAt: status === 'PUBLISHED' ? (existing.publishedAt ?? new Date()) : null,
      },
    });
    revalidateTag('posts:list', 'max');
    revalidateTag(`post:${existing.slug}`, 'max');
    revalidateTag(`post:${slug}`, 'max');
    return { success: true, data: post };
  } catch {
    return { success: false, error: 'Erro ao atualizar post. Tente novamente.' };
  }
}

export async function deletePost(
  _prev: ActionResult<void> | null,
  formData: FormData
): Promise<ActionResult<void>> {
  const session = await getSession().catch(() => null);
  if (!session || session.role !== 'ADMIN') {
    return { success: false, error: 'Acesso restrito a administradores.' };
  }

  const parsed = postIdSchema.safeParse({ id: formData.get('id') });
  if (!parsed.success) {
    return { success: false, error: 'ID do post inválido.' };
  }

  try {
    const post = await prisma.post.findUnique({
      where: { id: parsed.data.id },
      select: { slug: true },
    });
    if (!post) {
      return { success: false, error: 'Post não encontrado.' };
    }
    await prisma.post.delete({ where: { id: parsed.data.id } });
    revalidateTag('posts:list', 'max');
    revalidateTag(`post:${post.slug}`, 'max');
    return { success: true, data: undefined };
  } catch {
    return { success: false, error: 'Erro ao remover post. Tente novamente.' };
  }
}

export async function publishPost(
  _prev: ActionResult<Post> | null,
  formData: FormData
): Promise<ActionResult<Post>> {
  const session = await getSession().catch(() => null);
  if (!session || session.role !== 'ADMIN') {
    return { success: false, error: 'Acesso restrito a administradores.' };
  }

  const parsed = postIdSchema.safeParse({ id: formData.get('id') });
  if (!parsed.success) {
    return { success: false, error: 'ID do post inválido.' };
  }

  try {
    const post = await prisma.post.update({
      where: { id: parsed.data.id },
      data: { status: 'PUBLISHED', publishedAt: new Date() },
    });
    revalidateTag('posts:list', 'max');
    revalidateTag(`post:${post.slug}`, 'max');
    return { success: true, data: post };
  } catch {
    return { success: false, error: 'Erro ao publicar. Tente novamente.' };
  }
}

export async function unpublishPost(
  _prev: ActionResult<Post> | null,
  formData: FormData
): Promise<ActionResult<Post>> {
  const session = await getSession().catch(() => null);
  if (!session || session.role !== 'ADMIN') {
    return { success: false, error: 'Acesso restrito a administradores.' };
  }

  const parsed = postIdSchema.safeParse({ id: formData.get('id') });
  if (!parsed.success) {
    return { success: false, error: 'ID do post inválido.' };
  }

  try {
    const post = await prisma.post.update({
      where: { id: parsed.data.id },
      data: { status: 'DRAFT' },
    });
    revalidateTag('posts:list', 'max');
    revalidateTag(`post:${post.slug}`, 'max');
    return { success: true, data: post };
  } catch {
    return { success: false, error: 'Erro ao despublicar. Tente novamente.' };
  }
}
