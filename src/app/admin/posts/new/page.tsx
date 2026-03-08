import Link from 'next/link';
import { PostForm } from '@/components/admin/post-form';

export default function NewPostPage() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-12">
      <Link
        href="/admin/posts"
        className="font-ui text-sm text-muted-foreground hover:text-foreground mb-6 inline-block"
      >
        ← Voltar aos posts
      </Link>
      <h1 className="font-body text-2xl font-semibold text-foreground mb-8">Novo post</h1>
      <PostForm />
    </main>
  );
}
