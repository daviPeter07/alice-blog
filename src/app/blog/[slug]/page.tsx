import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import ReactMarkdown from 'react-markdown';
import remarkBreaks from 'remark-breaks';
import type { Metadata } from 'next';

import { getPostBySlug, getPublishedPostSlugs } from '@/data-access/posts';
import { getLikeByPostAndFingerprint } from '@/data-access/likes';
import { getSession } from '@/lib/auth';
import { postSlugParamsSchema } from '@/lib/schemas/post.schema';
import { Badge } from '@/components/ui/badge';
import { PostFooter } from '@/components/blog/post-footer';
import { AdminCheck } from '@/components/ui/admin-check';
import { formatDate, getInitials } from '@/helpers';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = await getPublishedPostSlugs();
  return slugs.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const parsed = postSlugParamsSchema.safeParse({ slug });
  if (!parsed.success) return {};
  return {
    title: decodeURIComponent(parsed.data.slug.replace(/-/g, ' ')),
  };
}

function PostSkeleton() {
  return (
    <main className="max-w-4xl mx-auto px-6 py-16">
      <div className="animate-pulse space-y-6">
        <div className="h-6 bg-muted rounded w-1/3" />
        <div className="h-10 bg-muted rounded w-full" />
        <div className="h-4 bg-muted rounded w-2/3" />
        <div className="h-48 bg-muted rounded w-full" />
      </div>
    </main>
  );
}

async function PostContent({ slug }: { slug: string }) {
  const post = await getPostBySlug(slug);
  if (!post || post.status === 'DRAFT') notFound();

  const session = await getSession().catch(() => null);
  const initialLiked = session ? await getLikeByPostAndFingerprint(post.id, session.userId) : false;

  return (
    <main className="max-w-4xl mx-auto px-6 py-16">
      <header className="mb-10">
        {/* Tags */}
        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {post.tags.map((tag) => (
              <Badge key={tag} variant="secondary">
                {tag}
              </Badge>
            ))}
          </div>
        )}

        {/* Título */}
        <h1 className="font-heading text-4xl font-semibold text-foreground leading-snug mb-5">
          {post.title}
        </h1>

        {/* Meta do autor */}
        <div className="flex items-center gap-3 text-sm text-muted-foreground font-ui">
          {post.author.image ? (
            <Image
              src={post.author.image}
              alt={post.author.name ?? ''}
              width={32}
              height={32}
              className="rounded-full object-cover"
            />
          ) : (
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-brown/20 text-sm font-medium text-brand-brown">
              {getInitials(post.author.name ?? '') || '?'}
            </div>
          )}

          <span className="font-medium text-foreground">{post.author.name}</span>
          {post.author.role === 'ADMIN' && <AdminCheck size={16} className="text-brand-green" />}

          {post.publishedAt && (
            <>
              <span aria-hidden>·</span>
              <time dateTime={post.publishedAt.toISOString()}>{formatDate(post.publishedAt)}</time>
            </>
          )}

          {post.readingTime && (
            <>
              <span aria-hidden>·</span>
              <span>{post.readingTime} min de leitura</span>
            </>
          )}
        </div>
      </header>

      {/* Corpo do post — mesmo estilo de espaçamento dos comentários */}
      <div className="article-read-container" data-article-read>
        <article className="prose-alice prose-alice-comment max-w-none">
          <ReactMarkdown remarkPlugins={[remarkBreaks]}>{post.content}</ReactMarkdown>
        </article>
      </div>

      <PostFooter
        postId={post.id}
        postUrl={`/blog/${post.slug}`}
        initialLikeCount={post._count.likes}
        initialLiked={initialLiked}
        initialComments={post.comments}
        isAuthenticated={!!session}
        currentUser={
          session ? { name: session.name, email: session.email, role: session.role } : null
        }
      />
    </main>
  );
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const parsed = postSlugParamsSchema.safeParse({ slug });
  if (!parsed.success) notFound();

  return (
    <Suspense fallback={<PostSkeleton />}>
      <PostContent slug={slug} />
    </Suspense>
  );
}
