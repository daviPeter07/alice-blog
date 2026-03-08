'use client';

import ReactMarkdown from 'react-markdown';
import remarkBreaks from 'remark-breaks';
import rehypeRaw from 'rehype-raw';
import type { CreateCommentInput } from '@/lib/schemas/comment.schema';
import type { ActionResult } from '@/lib/types';
import { formatDate, getInitials, avatarHue } from '@/helpers';
import type { OptimisticComment } from '@/hooks';
import { AdminCheck } from '@/components/ui/admin-check';
import { ReplyForm } from '@/components/blog/reply-form';
import { CommentActions } from '@/components/blog/comment-actions';

export interface CommentItemProps {
  comment: OptimisticComment;
  allComments: OptimisticComment[];
  postId: string;
  replyingToId: string | null;
  onReplyClick: (id: string | null) => void;
  onReplySubmit: (parentId: string, data: CreateCommentInput) => void;
  isPending: boolean;
  state: ActionResult | null;
  currentUser?: { name: string; email: string; role?: 'ADMIN' | 'READER' } | null;
  isAuthenticated?: boolean;
  onCommentMutated?: () => void;
}

export function CommentItem({
  comment,
  allComments,
  postId,
  replyingToId,
  onReplyClick,
  onReplySubmit,
  isPending,
  state,
  currentUser,
  isAuthenticated = true,
  onCommentMutated,
}: CommentItemProps) {
  const isAdmin =
    comment.author?.role === 'ADMIN' ||
    (comment.pending &&
      currentUser?.role === 'ADMIN' &&
      comment.authorEmail === currentUser?.email);
  const persistedReplies = comment.replies ?? [];
  const optimisticReplyIds = new Set(persistedReplies.map((r) => r.id));
  const fromOptimistic = allComments.filter(
    (c) => c.parentId === comment.id && !optimisticReplyIds.has(c.id)
  );
  const replies: OptimisticComment[] = [...persistedReplies, ...fromOptimistic]
    .map((r) => ({ ...r, replies: (r as OptimisticComment).replies ?? [] }))
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  const hue = avatarHue(comment.authorName);
  const isReplying = replyingToId === comment.id;

  return (
    <li className={`flex gap-4 animate-fade-in ${comment.pending ? 'opacity-50' : ''}`}>
      <div
        className="shrink-0 w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-ui font-semibold select-none mt-0.5"
        style={{ background: `oklch(0.55 0.12 ${hue})` }}
        aria-hidden
      >
        {getInitials(comment.authorName)}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-baseline gap-2 mb-1.5">
          <span className="font-ui text-sm font-semibold text-foreground">
            {comment.authorName}
          </span>
          {isAdmin && <AdminCheck size={14} />}
          {!comment.pending && (
            <time className="font-ui text-xs text-muted-foreground">
              {formatDate(comment.createdAt)}
            </time>
          )}
          {comment.pending && (
            <span className="font-ui text-xs text-muted-foreground italic">enviando…</span>
          )}
        </div>

        <div className="font-ui text-sm text-foreground/85 leading-relaxed prose prose-sm prose-alice prose-alice-comment max-w-none">
          <ReactMarkdown remarkPlugins={[remarkBreaks]} rehypePlugins={[rehypeRaw]}>
            {comment.body}
          </ReactMarkdown>
        </div>

        <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1">
          {!comment.parentId && isAuthenticated && (
            <button
              type="button"
              onClick={() => onReplyClick(isReplying ? null : comment.id)}
              className="font-ui text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              Responder
            </button>
          )}
          {onCommentMutated && !comment.pending && (
            <CommentActions
              commentId={comment.id}
              postId={postId}
              body={comment.body}
              authorEmail={comment.authorEmail}
              createdAt={comment.createdAt}
              currentUserEmail={currentUser?.email}
              onDeleted={onCommentMutated}
              onUpdated={onCommentMutated}
            />
          )}
        </div>

        {isReplying && (
          <ReplyForm
            postId={postId}
            parentId={comment.id}
            parentAuthorName={comment.authorName}
            onSubmit={onReplySubmit}
            onCancel={() => onReplyClick(null)}
            isPending={isPending}
            state={state}
            currentUser={currentUser}
          />
        )}

        {replies.length > 0 && (
          <ul className="mt-4 pl-4 border-l border-border flex flex-col gap-4">
            {replies.map((reply) => (
              <CommentItem
                key={reply.id}
                comment={reply}
                allComments={allComments}
                postId={postId}
                replyingToId={replyingToId}
                onReplyClick={onReplyClick}
                onReplySubmit={onReplySubmit}
                isPending={isPending}
                state={state}
                currentUser={currentUser}
                isAuthenticated={isAuthenticated}
                onCommentMutated={onCommentMutated}
              />
            ))}
          </ul>
        )}
      </div>
    </li>
  );
}
