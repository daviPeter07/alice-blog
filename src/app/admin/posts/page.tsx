import Link from 'next/link';
import { getSession } from '@/lib/auth';
import { getPostsForAdmin } from '@/data-access/posts';
import { formatDate } from '@/helpers';

export default async function AdminPostsPage() {
  await getSession();
  const posts = await getPostsForAdmin();

  return (
    <main className="max-w-3xl mx-auto px-6 py-12">
      <div className="flex items-center justify-between mb-10">
        <h1 className="font-body text-2xl font-semibold text-foreground">Posts</h1>
        <Link
          href="/admin/posts/new"
          className="font-ui text-sm font-medium px-4 py-2 rounded-lg bg-brand-green text-white hover:bg-brand-green/90 transition-colors"
        >
          Novo post
        </Link>
      </div>

      <ul className="space-y-4">
        {posts.length === 0 ? (
          <li className="font-ui text-sm text-muted-foreground py-8">
            Nenhum post ainda. Crie o primeiro.
          </li>
        ) : (
          posts.map((post) => (
            <li
              key={post.id}
              className="flex items-center justify-between gap-4 py-3 border-b border-border last:border-0"
            >
              <div className="min-w-0 flex-1">
                <Link
                  href={`/admin/posts/${post.id}/edit`}
                  className="font-body font-medium text-foreground hover:text-brand-green transition-colors block truncate"
                >
                  {post.title}
                </Link>
                <p className="font-ui text-xs text-muted-foreground mt-0.5">
                  {post.status} · {post.slug}
                  {post.publishedAt && ` · ${formatDate(post.publishedAt)}`}
                </p>
              </div>
              <Link
                href={`/admin/posts/${post.id}/edit`}
                className="font-ui text-sm text-muted-foreground hover:text-foreground shrink-0"
              >
                Editar
              </Link>
            </li>
          ))
        )}
      </ul>
    </main>
  );
}
