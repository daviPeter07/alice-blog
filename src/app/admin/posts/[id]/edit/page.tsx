import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getPostById } from '@/data-access/posts';
import { EditPostForm } from './edit-post-form';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditPostPage({ params }: PageProps) {
  const { id } = await params;
  const post = await getPostById(id);
  if (!post) notFound();

  return (
    <main className="max-w-3xl mx-auto px-6 py-12">
      <Link
        href="/admin/posts"
        className="font-ui text-sm text-muted-foreground hover:text-foreground mb-6 inline-block"
      >
        ← Voltar aos posts
      </Link>
      <h1 className="font-body text-2xl font-semibold text-foreground mb-8">
        Editar: {post.title}
      </h1>
      <EditPostForm post={post} />
    </main>
  );
}
