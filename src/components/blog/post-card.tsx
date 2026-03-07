import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { ArrowRight } from 'lucide-react';
import { formatDate } from '@/helpers';

export interface PostCardProps {
  slug: string;
  title: string;
  excerpt: string;
  publishedAt: Date | null;
  tags: string[];
  readingTime: number | null;
  author: { name: string; image: string | null };
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
      className="group block animate-fade-up focus-visible:outline-none"
      style={{ animationDelay: `${index * 90}ms` }}
    >
      <article
        className="
          relative rounded-2xl border border-border bg-card px-7 py-6
          transition-all duration-300 ease-out
          hover:border-brand-green/30
          hover:shadow-[0_8px_32px_0_rgba(27,48,34,0.1)]
          hover:-translate-y-1
        "
      >
        {/* Tags */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="font-ui text-[11px]">
                {tag}
              </Badge>
            ))}
          </div>
        )}

        {/* Título */}
        <h2 className="font-body text-[1.4rem] font-semibold text-foreground leading-snug mb-3 group-hover:text-brand-green transition-colors duration-200">
          {title}
        </h2>

        {/* Excerpt */}
        <p className="font-ui text-muted-foreground text-[0.95rem] leading-relaxed line-clamp-2 mb-6">
          {excerpt}
        </p>

        {/* Rodapé */}
        <div className="flex items-center justify-between">
          <div className="flex flex-wrap items-center gap-2 text-[0.8rem] text-muted-foreground font-ui">
            <span className="font-medium text-foreground/80">{author.name}</span>
            {publishedAt && (
              <>
                <span aria-hidden className="text-border">
                  ·
                </span>
                <time dateTime={publishedAt.toISOString()}>{formatDate(publishedAt)}</time>
              </>
            )}
            {readingTime && (
              <>
                <span aria-hidden className="text-border">
                  ·
                </span>
                <span>{readingTime} min</span>
              </>
            )}
          </div>

          <div className="flex items-center gap-3 text-[0.75rem] text-muted-foreground font-ui shrink-0 ml-4">
            {likesCount > 0 && <span>{likesCount} ♥</span>}
            {commentsCount > 0 && <span>{commentsCount}</span>}
            <ArrowRight
              size={14}
              className="text-brand-green opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200"
            />
          </div>
        </div>
      </article>
    </Link>
  );
}
