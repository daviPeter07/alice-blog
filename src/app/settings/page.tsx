import { Suspense } from 'react';
import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';

export const metadata = {
  title: 'Configurações',
  description: 'Configurações da sua conta.',
};

async function SettingsContent() {
  const session = await getSession().catch(() => null);
  if (!session) {
    redirect('/auth/login');
  }

  return (
    <main className="max-w-2xl mx-auto px-6 py-12">
      <h1 className="font-body text-2xl font-semibold text-foreground mb-6">Configurações</h1>
      <p className="font-ui text-muted-foreground">
        Estrutura base para a feature 004 (paleta configurável, layout navbar, layout leitura).
      </p>
    </main>
  );
}

function SettingsFallback() {
  return (
    <main className="max-w-2xl mx-auto px-6 py-12">
      <div className="animate-pulse space-y-4">
        <div className="h-8 bg-muted rounded w-48" />
        <div className="h-4 bg-muted rounded w-full max-w-md" />
      </div>
    </main>
  );
}

export default function SettingsPage() {
  return (
    <Suspense fallback={<SettingsFallback />}>
      <SettingsContent />
    </Suspense>
  );
}
