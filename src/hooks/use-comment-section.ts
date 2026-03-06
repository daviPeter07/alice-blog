'use client';

import {
  useActionState,
  useOptimistic,
  startTransition,
  useRef,
  useState,
  useEffect,
  useCallback,
} from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createComment } from '@/actions/comments';
import { createCommentSchema, type CreateCommentInput } from '@/lib/schemas/comment.schema';
import type { ActionResult, CommentWithReplies } from '@/lib/types';

export type OptimisticComment = CommentWithReplies & { pending?: boolean };

function valuesToFormData(data: CreateCommentInput): FormData {
  const fd = new FormData();
  fd.set('postId', data.postId);
  if (data.parentId) fd.set('parentId', data.parentId);
  fd.set('authorName', data.authorName);
  fd.set('authorEmail', data.authorEmail);
  fd.set('body', data.body);
  return fd;
}

export interface UseCommentSectionOptions {
  postId: string;
  initialComments: CommentWithReplies[];
}

export interface UseCommentSectionReturn {
  mainForm: ReturnType<typeof useForm<CreateCommentInput>>;
  state: ActionResult | null;
  formAction: (formData: FormData) => void;
  isPending: boolean;
  optimisticComments: OptimisticComment[];
  replyingToId: string | null;
  setReplyingToId: (id: string | null) => void;
  replyFormRef: React.RefObject<HTMLFormElement | null>;
  onMainSubmit: (data: CreateCommentInput) => void;
  handleReplySubmit: (parentId: string, data: CreateCommentInput) => void;
}

export function useCommentSection({
  postId,
  initialComments,
}: UseCommentSectionOptions): UseCommentSectionReturn {
  const replyFormRef = useRef<HTMLFormElement | null>(null);
  const [replyingToId, setReplyingToId] = useState<string | null>(null);

  const [state, formAction, isPending] = useActionState<ActionResult | null, FormData>(
    createComment,
    null
  );

  const mainForm = useForm<CreateCommentInput>({
    resolver: zodResolver(createCommentSchema),
    mode: 'onChange',
    defaultValues: {
      postId,
      authorName: '',
      authorEmail: '',
      body: '',
    },
  });

  useEffect(() => {
    if (state?.success === false && state.fieldErrors) {
      (Object.entries(state.fieldErrors) as [keyof CreateCommentInput, string[]][]).forEach(
        ([field, messages]) => {
          mainForm.setError(field, { message: messages?.[0] });
        }
      );
    }
  }, [state, mainForm]);

  const [optimisticComments, addOptimisticComment] = useOptimistic<
    OptimisticComment[],
    OptimisticComment
  >(initialComments, (current, next) => [next, ...current]);

  const addOptimistic = useCallback((data: CreateCommentInput) => {
    startTransition(() => {
      addOptimisticComment({
        id: `optimistic-${Date.now()}`,
        postId: data.postId,
        parentId: data.parentId ?? null,
        authorName: data.authorName,
        authorEmail: data.authorEmail,
        approved: false,
        body: data.body,
        createdAt: new Date(),
        replies: [],
        pending: true,
      });
    });
  }, [addOptimisticComment]);

  const onMainSubmit = useCallback(
    (data: CreateCommentInput) => {
      const payload = { ...data, postId };
      addOptimistic(payload);
      mainForm.reset({ postId, authorName: '', authorEmail: '', body: '' });
      formAction(valuesToFormData(payload));
    },
    [postId, addOptimistic, mainForm, formAction]
  );

  const handleReplySubmit = useCallback(
    (parentId: string, data: CreateCommentInput) => {
      const payload = { ...data, postId, parentId };
      addOptimistic(payload);
      setReplyingToId(null);
      formAction(valuesToFormData(payload));
    },
    [postId, addOptimistic, formAction]
  );

  return {
    mainForm,
    state,
    formAction,
    isPending,
    optimisticComments,
    replyingToId,
    setReplyingToId,
    replyFormRef,
    onMainSubmit,
    handleReplySubmit,
  };
}
