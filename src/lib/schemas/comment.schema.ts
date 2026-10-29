import { z } from 'zod';

const commentBodySchema = z
  .string()
  .trim()
  .min(3, { message: 'Comentário deve ter pelo menos 3 caracteres.' })
  .max(5000, { message: 'Comentário deve ter no máximo 5.000 caracteres.' });

export const createCommentSchema = z.object({
  postId: z.string().cuid({ message: 'ID do post inválido.' }),
  parentId: z.string().cuid({ message: 'ID do comentário pai inválido.' }).optional(),
  authorName: z
    .string()
    .min(2, { message: 'Nome deve ter pelo menos 2 caracteres.' })
    .max(100, { message: 'Nome deve ter no máximo 100 caracteres.' }),
  authorEmail: z.string().email({ message: 'E-mail inválido.' }),
  body: commentBodySchema,
});

export const commentRefSchema = z.object({
  commentId: z.string().cuid({ message: 'Comentário inválido.' }),
  postId: z.string().cuid({ message: 'ID do post inválido.' }),
});

export const updateCommentSchema = commentRefSchema.extend({ body: commentBodySchema });

export type CreateCommentInput = z.infer<typeof createCommentSchema>;
