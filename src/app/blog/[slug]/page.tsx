import { Suspense } from "react";
import { notFound } from "next/navigation";
import Image from "next/image";
import type { Metadata } from "next";

import { getPostBySlug, getPublishedPostSlugs } from "@/data-access/posts";
import { postSlugParamsSchema } from "@/lib/schemas/post.schema";
import { Badge } from "@/components/ui/badge";
import { CommentSection } from "@/components/blog/comment-section";
import { formatDate } from "@/helpers/date";
import { getInitials } from "@/helpers/author";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = await getPublishedPostSlugs();
  return slugs.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const parsed = postSlugParamsSchema.safeParse({ slug });
  if (!parsed.success) return {};
  return {
    title: decodeURIComponent(parsed.data.slug.replace(/-/g, " ")),
  };
}

function PostSkeleton() {
  return (
    <main className="max-w-2xl mx-auto px-6 py-16">
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
  if (!post || post.status === "DRAFT") notFound();

  return (
    <main className="max-w-2xl mx-auto px-6 py-16">
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
        <h1 className="font-body text-4xl font-semibold text-foreground leading-snug mb-5">
          {post.title}
        </h1>

        {/* Meta do autor */}
        <div className="flex items-center gap-3 text-sm text-muted-foreground font-ui">
          {post.author.image ? (
            <Image
              src={post.author.image}
              alt={post.author.name ?? ""}
              width={32}
              height={32}
              className="rounded-full object-cover"
            />
          ) : (
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-brown/20 text-sm font-medium text-brand-brown">
              {getInitials(post.author.name ?? "") || "?"}
            </div>
          )}

          <span className="font-medium text-foreground">
            {post.author.name}
          </span>

          {post.publishedAt && (
            <>
              <span aria-hidden>·</span>
              <time dateTime={post.publishedAt.toISOString()}>
                {formatDate(post.publishedAt)}
              </time>
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

      {/* Corpo do post */}
      <article className="prose-alice mb-14 whitespace-pre-wrap">
        {post.content}
      </article>

      {/* Divisor */}
      <hr className="border-border mb-10" />

      {/* LikeButton — placeholder até US3 */}
      <div
        data-placeholder="like-button"
        data-post-id={post.id}
        data-initial-count={post._count.likes}
        data-initial-liked="false"
        className="mb-10 h-10"
      />

      {/* CommentSection — US2 */}
      <CommentSection postId={post.id} initialComments={post.comments} />
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
