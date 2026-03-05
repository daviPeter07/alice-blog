import { z } from 'zod';

export const postSlugParamsSchema = z.object({
  slug: z
    .string()
    .min(1, { message: 'Slug não pode ser vazio.' })
    .max(200, { message: 'Slug muito longo.' })
    .regex(/^[a-z0-9-]+$/, {
      message: 'Slug deve conter apenas letras minúsculas, números e hífens.',
    }),
});

export type PostSlugParams = z.infer<typeof postSlugParamsSchema>;
