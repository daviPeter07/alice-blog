'use client';

import { Controller, type Control, type FieldErrors, type UseFormRegister } from 'react-hook-form';
import { MarkdownContentField } from '@/components/admin/markdown-content-field';
import type { CreatePostFormInput } from '@/lib/schemas/post.schema';
import { cn } from '@/lib/utils';

const inputBaseClass =
  'w-full rounded-lg border border-input bg-background px-4 py-2.5 font-ui text-sm text-foreground resize-none';

export interface PostFormFieldsProps {
  register: UseFormRegister<CreatePostFormInput>;
  control: Control<CreatePostFormInput>;
  errors: FieldErrors<CreatePostFormInput>;
}

export function PostFormFields({ register, control, errors }: PostFormFieldsProps) {
  return (
    <div className="space-y-6">
      <div>
        <label htmlFor="title" className="block font-ui text-sm font-medium text-foreground mb-1.5">
          Título
        </label>
        <input
          id="title"
          type="text"
          placeholder="Digite o título do artigo"
          className={cn(inputBaseClass, errors.title && 'border-destructive')}
          {...register('title')}
        />
        {errors.title && (
          <p className="mt-1 font-ui text-xs text-destructive">{errors.title.message}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="excerpt"
          className="block font-ui text-sm font-medium text-foreground mb-1.5"
        >
          Resumo
        </label>
        <textarea
          id="excerpt"
          rows={2}
          placeholder="Breve resumo do artigo (opcional)"
          className={cn(inputBaseClass, errors.excerpt && 'border-destructive')}
          {...register('excerpt')}
        />
        {errors.excerpt && (
          <p className="mt-1 font-ui text-xs text-destructive">{errors.excerpt.message}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="content"
          className="block font-ui text-sm font-medium text-foreground mb-1.5"
        >
          Conteúdo
        </label>
        <Controller
          name="content"
          control={control}
          render={({ field }) => (
            <MarkdownContentField
              id="content"
              name="content"
              value={field.value}
              onChange={field.onChange}
              required
              placeholder="Escreva seu artigo em Markdown. Use **negrito**, *itálico*, # título, - lista..."
            />
          )}
        />
        {errors.content && (
          <p className="mt-1 font-ui text-xs text-destructive">{errors.content.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="tags" className="block font-ui text-sm font-medium text-foreground mb-1.5">
          Tags (separadas por vírgula)
        </label>
        <input
          id="tags"
          type="text"
          placeholder="filosofia, reflexão, história"
          className={cn(
            'w-full rounded-lg border border-input bg-background px-4 py-2.5 font-ui text-sm text-foreground',
            errors.tags && 'border-destructive'
          )}
          {...register('tags')}
        />
        {errors.tags && (
          <p className="mt-1 font-ui text-xs text-destructive">{errors.tags.message}</p>
        )}
      </div>
    </div>
  );
}
