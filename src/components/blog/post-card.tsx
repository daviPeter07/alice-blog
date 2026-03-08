import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { AdminCheck } from '@/components/ui/admin-check';
import { ArrowRight, Heart, MessageCircle } from 'lucide-react';
import { formatDate } from '@/helpers';

export interface PostCardProps {
  slug: string;
  title: string;
  excerpt: string;
  publishedAt: Date | null;
  tags: string[];
  readingTime: number;
  author: { name: string; image: string | null; role?: 'ADMIN' | 'READER' };
  likesCount: number;
  commentsCount: number;
  index?: number;
}

export function PostCard({
  slug,
  title,
  excerpt,
  publishedAt,
  tags,
  readingTime,
  author,
  likesCount,
  commentsCount,
  index = 0,
}: PostCardProps) {
  return (
    <Link
      href={`/blog/${slug}`}
      className={`group block reveal-item ${index % 2 === 0 ? 'reveal-from-left' : 'reveal-from-right'} focus-visible:outline-none reveal-delay-${Math.min(index, 11)}`}
    >
      <article
        className="
          relative flex flex-col h-[320px] rounded-2xl border border-border bg-card px-7 py-6
          transition-all duration-300 ease-out
          hover:border-brand-green/30
          hover:shadow-[0_8px_32px_0_rgba(27,48,34,0.1)]
          hover:-translate-y-1
        "
      >
        {/* Tags */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3 min-h-[28px]">
            {tags.slice(0, 6).map((tag) => (
              <Badge
                key={tag}
                variant="secondary"
                className="font-ui text-[11px] max-w-[120px] truncate border border-brand-green/20 bg-brand-green/5 text-foreground
                  group-hover:border-brand-green/35 group-hover:bg-brand-green/8
                  theme-dark:border-brand-green-light/50 theme-dark:bg-brand-green-light/25 theme-dark:text-foreground
                  theme-dark:group-hover:border-brand-green-light/60 theme-dark:group-hover:bg-brand-green-light/35
                  transition-colors"
                title={tag}
              >
                {tag.length > 20 ? `${tag.slice(0, 18)}…` : tag}
              </Badge>
            ))}
          </div>
        )}

        {/* Título */}
        <h2
          className="font-heading text-[1.25rem] font-semibold text-foreground leading-snug mb-2 line-clamp-2 group-hover:text-brand-green transition-colors duration-200 overflow-hidden"
          title={title}
        >
          {title}
        </h2>

        {/* Excerpt */}
        <p
          className="font-ui text-muted-foreground text-[0.9rem] leading-relaxed line-clamp-2 mb-4 flex-1 min-h-0 overflow-hidden"
          title={excerpt}
        >
          {excerpt}
        </p>

        {/* Header/rodapé: autor em cima, demais info embaixo */}
        <div className="flex flex-col gap-2 shrink-0 min-w-0">
          <div className="flex items-center gap-2 min-w-0 overflow-hidden">
            <span
              className="font-medium text-foreground/80 text-[0.9rem] truncate"
              title={author.name}
            >
              {author.name}
            </span>
            {author.role === 'ADMIN' && <AdminCheck size={12} className="shrink-0" />}
          </div>

          <div className="flex items-center justify-between gap-4 text-[0.75rem] text-muted-foreground font-ui min-w-0">
            <div className="flex items-center gap-2 min-w-0 overflow-hidden">
              {publishedAt ? (
                <time
                  dateTime={publishedAt.toISOString()}
                  className="shrink-0"
                  title={formatDate(publishedAt)}
                >
                  {formatDate(publishedAt)}
                </time>
              ) : (
                <span className="shrink-0">—</span>
              )}
              <span aria-hidden className="text-border shrink-0">
                ·
              </span>
              <span className="shrink-0">{readingTime} min</span>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <span className="flex items-center gap-1" title="Curtidas">
                <Heart size={12} className="shrink-0" aria-hidden />
                {likesCount}
              </span>
              <span className="flex items-center gap-1" title="Comentários">
                <MessageCircle size={12} className="shrink-0" aria-hidden />
                {commentsCount}
              </span>
              <ArrowRight
                size={14}
                className="text-brand-green opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200"
              />
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
}
