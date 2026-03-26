import { Suspense } from 'react';
import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import { LoadingDots } from '@/components/ui/loading-dots';

/** Admin sempre dinâmico: evita Prisma/cookies durante `next build` sem DB. */
export const dynamic = 'force-dynamic';

async function AdminAuthGuard({ children }: { children: React.ReactNode }) {
  const session = await getSession().catch(() => null);
  if (!session) {
    redirect('/auth/login');
  }
  if (session.role !== 'ADMIN') {
    redirect('/');
  }
  return <>{children}</>;
}

export default function AdminLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <Suspense
      fallback={
        <div className="max-w-3xl mx-auto px-6 py-12 flex items-center justify-center min-h-[200px]">
          <LoadingDots size="lg" className="text-muted-foreground" />
        </div>
      }
    >
      <AdminAuthGuard>{children}</AdminAuthGuard>
    </Suspense>
  );
}
