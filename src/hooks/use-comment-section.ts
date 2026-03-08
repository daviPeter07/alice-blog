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
  currentUser?: { name: string; email: string } | null;
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
  currentUser = null,
}: UseCommentSectionOptions): UseCommentSectionReturn {
  const replyFormRef = useRef<HTMLFormElement | null>(null);
  const lastSubmitWasReplyRef = useRef(false);
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
      authorName: currentUser?.name ?? '',
      authorEmail: currentUser?.email ?? '',
      body: '',
    },
  });

  useEffect(() => {
    if (state?.success === false && state.fieldErrors && !lastSubmitWasReplyRef.current) {
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

  const addOptimistic = useCallback(
    (data: CreateCommentInput) => {
      startTransition(() => {
        addOptimisticComment({
          id: `optimistic-${Date.now()}`,
          postId: data.postId,
          parentId: data.parentId ?? null,
          authorId: null,
          authorName: data.authorName,
          authorEmail: data.authorEmail,
          approved: false,
          body: data.body,
          createdAt: new Date(),
          replies: [],
          pending: true,
        });
      });
    },
    [addOptimisticComment]
  );

  const onMainSubmit = useCallback(
    (data: CreateCommentInput) => {
      lastSubmitWasReplyRef.current = false;
      const payload = {
        ...data,
        postId,
        authorName: currentUser?.name ?? data.authorName,
        authorEmail: currentUser?.email ?? data.authorEmail,
      };
      addOptimistic(payload);
      mainForm.reset({
        postId,
        authorName: currentUser?.name ?? '',
        authorEmail: currentUser?.email ?? '',
        body: '',
      });
      startTransition(() => {
        formAction(valuesToFormData(payload));
      });
    },
    [postId, currentUser, addOptimistic, mainForm, formAction]
  );

  const handleReplySubmit = useCallback(
    (parentId: string, data: CreateCommentInput) => {
      lastSubmitWasReplyRef.current = true;
      const payload = {
        ...data,
        postId,
        parentId,
        authorName: currentUser?.name ?? data.authorName,
        authorEmail: currentUser?.email ?? data.authorEmail,
      };
      addOptimistic(payload);
      setReplyingToId(null);
      startTransition(() => {
        formAction(valuesToFormData(payload));
      });
    },
    [postId, currentUser, addOptimistic, formAction]
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
