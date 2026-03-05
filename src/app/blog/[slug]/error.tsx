'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function BlogPostError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Blog post error:', error.message);
  }, [error]);

  return (
    <main className="max-w-2xl mx-auto px-6 py-16 text-center">
      <h1 className="font-body text-2xl font-semibold text-foreground mb-3">Algo deu errado</h1>
      <p className="font-ui text-muted-foreground mb-8 max-w-md mx-auto">
        Não foi possível carregar este artigo.
      </p>
      <div className="flex flex-wrap justify-center gap-4">
        <Button variant="outline" onClick={reset}>
          Tentar de novo
        </Button>
        <Button asChild variant="secondary">
          <Link href="/blog">Ver todos os artigos</Link>
        </Button>
      </div>
    </main>
  );
}
