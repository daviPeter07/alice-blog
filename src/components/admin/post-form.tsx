'use client';

import { useState, useActionState, useEffect, startTransition } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createPost, updatePost, deletePost, publishPost, unpublishPost } from '@/actions/posts';
import { useToastOnSuccess } from '@/hooks';
import { slugFromTitle } from '@/helpers';
import { createPostFormSchema, type CreatePostFormInput } from '@/lib/schemas/post.schema';
import { PostFormFields } from '@/components/admin/post-form-fields';
import { PostFormFooter } from '@/components/admin/post-form-footer';
import { PostEditActions } from '@/components/admin/post-edit-actions';

export interface PostFormPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  tags: string[];
  status: string;
}

export interface PostFormProps {
  /** Quando fornecido, modo edição; caso contrário, modo criação */
  post?: PostFormPost;
}

const emptyDefaultValues: CreatePostFormInput = {
  title: '',
  excerpt: '',
  content: '',
  tags: '',
};

function toFormInput(post: PostFormPost): CreatePostFormInput {
  return {
    title: post.title,
    excerpt: post.excerpt,
    content: post.content,
    tags: Array.isArray(post.tags) ? post.tags.join(', ') : '',
  };
}

function toCreateFormData(data: CreatePostFormInput): FormData {
  const fd = new FormData();
  fd.set('title', data.title);
  fd.set('slug', slugFromTitle(data.title));
  fd.set('excerpt', data.excerpt);
  fd.set('content', data.content);
  fd.set('tags', data.tags);
  fd.set('status', 'DRAFT');
  return fd;
}

function toUpdateFormData(data: CreatePostFormInput, post: PostFormPost): FormData {
  const fd = new FormData();
  fd.set('id', post.id);
  fd.set('title', data.title);
  fd.set('slug', slugFromTitle(data.title));
  fd.set('excerpt', data.excerpt);
  fd.set('content', data.content);
  fd.set('tags', data.tags);
  fd.set('status', post.status);
  return fd;
}

function getServerError(
  createState: { success?: boolean; error?: string } | null,
  updateState: { success?: boolean; error?: string } | null,
  deleteState: { success?: boolean; error?: string } | null,
  publishState: { success?: boolean; error?: string } | null,
  unpublishState: { success?: boolean; error?: string } | null
): string | null {
  if (createState && !createState.success && 'error' in createState)
    return createState.error ?? null;
  if (updateState && !updateState.success && 'error' in updateState)
    return updateState.error ?? null;
  if (deleteState && !deleteState.success && 'error' in deleteState)
    return deleteState.error ?? null;
  if (publishState && !publishState.success && 'error' in publishState)
    return publishState.error ?? null;
  if (unpublishState && !unpublishState.success && 'error' in unpublishState)
    return unpublishState.error ?? null;
  return null;
}

export function PostForm({ post }: PostFormProps) {
  const router = useRouter();
  const isEdit = !!post;

  const [createState, createAction, isCreatePending] = useActionState(createPost, null);
  const [updateState, updateAction, isUpdatePending] = useActionState(updatePost, null);
  const [deleteState, deleteAction, isDeletePending] = useActionState(deletePost, null);
  const [publishState, publishAction, isPublishPending] = useActionState(publishPost, null);
  const [unpublishState, unpublishAction, isUnpublishPending] = useActionState(unpublishPost, null);

  useToastOnSuccess(createState, 'Rascunho criado com sucesso.');
  useToastOnSuccess(updateState, 'Post atualizado com sucesso.');
  useToastOnSuccess(deleteState, 'Post excluído com sucesso.');
  useToastOnSuccess(publishState, 'Post publicado com sucesso.');
  useToastOnSuccess(unpublishState, 'Post despublicado com sucesso.');

  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors, isValid },
  } = useForm<CreatePostFormInput>({
    resolver: zodResolver(createPostFormSchema),
    mode: 'onChange',
    defaultValues: post ? toFormInput(post) : emptyDefaultValues,
  });

  const title = watch('title');
  const slug = slugFromTitle(title);

  useEffect(() => {
    if (createState?.success && 'data' in createState && createState.data) {
      router.push(`/admin/posts/${createState.data.id}/edit`);
      router.refresh();
    }
  }, [createState, router]);

  useEffect(() => {
    if (updateState?.success) router.refresh();
  }, [updateState, router]);

  useEffect(() => {
    if (deleteState?.success) {
      router.push('/admin/posts');
      router.refresh();
    }
  }, [deleteState, router]);

  useEffect(() => {
    if (publishState?.success || unpublishState?.success) router.refresh();
  }, [publishState, unpublishState, router]);

  const isPending =
    isCreatePending || isUpdatePending || isDeletePending || isPublishPending || isUnpublishPending;

  const onSubmit = (data: CreatePostFormInput) => {
    if (isEdit && post) {
      startTransition(() => updateAction(toUpdateFormData(data, post)));
    } else {
      startTransition(() => createAction(toCreateFormData(data)));
    }
  };

  const serverError = getServerError(
    createState,
    updateState,
    deleteState,
    publishState,
    unpublishState
  );

  const submitDisabled = isPending || !isValid || (!isEdit && !slug.trim());

  return (
    <div className="space-y-8">
      {serverError && (
        <p className="font-ui text-sm text-destructive rounded-lg bg-destructive/10 px-4 py-2">
          {serverError}
        </p>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <PostFormFields register={register} control={control} errors={errors} />
        <PostFormFooter isEdit={isEdit} isPending={isPending} submitDisabled={submitDisabled} />
      </form>

      {isEdit && post && (
        <PostEditActions
          post={post}
          publishAction={publishAction}
          unpublishAction={unpublishAction}
          deleteAction={deleteAction}
          isPublishPending={isPublishPending}
          isUnpublishPending={isUnpublishPending}
          isDeletePending={isDeletePending}
          isPending={isPending}
        />
      )}
    </div>
  );
}
