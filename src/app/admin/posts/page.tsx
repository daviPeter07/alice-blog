import Link from 'next/link';
import { getSession } from '@/lib/auth';
import { getPostsForAdmin } from '@/data-access/posts';
import { formatDate } from '@/helpers';
import { PostRowActions } from '@/components/admin/post-row-actions';
import { cn } from '@/lib/utils';

export default async function AdminPostsPage() {
  // Layout já protege; chamamos getSession para optar em dynamic rendering (cookies)
  await getSession().catch(() => null);
  const posts = await getPostsForAdmin();

  return (
    <main className="max-w-3xl mx-auto px-6 py-12">
      <div className="flex items-center justify-between mb-10">
        <h1 className="font-heading text-base sm:text-4xl font-semibold text-foreground">Posts</h1>
        <Link
          href="/admin/posts/new"
          className="font-ui text-sm font-medium px-4 py-2 rounded-lg bg-brand-green text-white hover:bg-brand-green/90 transition-colors"
        >
          Novo post
        </Link>
      </div>

      <ul className="space-y-2">
        {posts.length === 0 ? (
          <li className="font-ui text-sm text-muted-foreground py-8">
            Nenhum post ainda. Crie o primeiro.
          </li>
        ) : (
          posts.map((post) => (
            <li
              key={post.id}
              className="flex items-center justify-between gap-4 py-4 px-4 -mx-4 rounded-lg hover:bg-muted/50 transition-colors border-b border-border last:border-0"
            >
              <div className="min-w-0 flex-1">
                <Link
                  href={`/admin/posts/${post.id}/edit`}
                  className="font-heading text-lg font-semibold text-foreground hover:text-brand-green transition-colors block truncate"
                >
                  {post.title}
                </Link>
                <div className="flex items-center gap-2 mt-1">
                  <span
                    className={cn(
                      'inline-flex items-center px-2 py-0.5 rounded text-xs font-medium',
                      post.status === 'PUBLISHED'
                        ? 'bg-brand-green text-white'
                        : 'bg-muted text-muted-foreground'
                    )}
                  >
                    {post.status === 'PUBLISHED' ? 'Publicado' : 'Rascunho'}
                  </span>
                  {post.publishedAt && (
                    <span className="font-ui text-xs text-muted-foreground">
                      {formatDate(post.publishedAt)}
                    </span>
                  )}
                </div>
              </div>
              <PostRowActions postId={post.id} postTitle={post.title} />
            </li>
          ))
        )}
      </ul>
    </main>
  );
}
