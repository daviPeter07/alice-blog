import { Suspense } from 'react';
import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';

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
        <div className="max-w-3xl mx-auto px-6 py-12 font-ui text-muted-foreground">
          Carregando…
        </div>
      }
    >
      <AdminAuthGuard>{children}</AdminAuthGuard>
    </Suspense>
  );
}
