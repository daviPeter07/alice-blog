import { z } from 'zod';

const postStatusSchema = z.enum(['DRAFT', 'PUBLISHED']);

export const postSlugParamsSchema = z.object({
  slug: z
    .string()
    .min(1, { message: 'Slug não pode ser vazio.' })
    .max(200, { message: 'Slug muito longo.' })
    .regex(/^[a-z0-9-]+$/, {
      message: 'Slug deve conter apenas letras minúsculas, números e hífens.',
    }),
});

export const createPostSchema = z.object({
  title: z.string().min(1, 'Título obrigatório.').max(300, 'Título muito longo.'),
  slug: z
    .string()
    .min(1, 'Slug obrigatório.')
    .max(200, 'Slug muito longo.')
    .regex(/^[a-z0-9-]+$/, 'Slug: apenas letras minúsculas, números e hífens.'),
  excerpt: z.string().max(500, 'Resumo muito longo.').default(''),
  content: z.string().min(1, 'Conteúdo obrigatório.'),
  tags: z
    .string()
    .optional()
    .default('')
    .transform((s) =>
      s
        ? s
            .split(',')
            .map((t) => t.trim())
            .filter(Boolean)
        : []
    ),
  status: postStatusSchema.default('DRAFT'),
});

export const updatePostSchema = createPostSchema.extend({
  id: z.string().cuid('ID do post inválido.'),
});

export const postIdSchema = z.object({
  id: z.string().cuid('ID do post inválido.'),
});

/** Schema do formulário de criar/editar post (slug omitido — derivado do título) */
export const createPostFormSchema = z.object({
  title: z.string().min(1, 'Título obrigatório.').max(300, 'Título muito longo.'),
  excerpt: z.string().max(500, 'Resumo muito longo.'),
  content: z.string().min(1, 'Conteúdo obrigatório.'),
  tags: z.string(),
});

/** Schema do formulário de editar post */
export const updatePostFormSchema = createPostFormSchema;

export type PostSlugParams = z.infer<typeof postSlugParamsSchema>;
export type CreatePostInput = z.infer<typeof createPostSchema>;
export type UpdatePostInput = z.infer<typeof updatePostSchema>;
export type CreatePostFormInput = z.infer<typeof createPostFormSchema>;
export type UpdatePostFormInput = z.infer<typeof updatePostFormSchema>;
