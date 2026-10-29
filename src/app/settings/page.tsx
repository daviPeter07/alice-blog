import { Suspense } from 'react';
import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import { LoadingDots } from '@/components/ui/loading-dots';
import { PreferencesPanel } from '@/components/preferences/preferences-panel';

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
      <h1 className="font-heading text-3xl font-semibold text-foreground">Configurações</h1>
      <p className="mt-2 mb-10 font-ui text-muted-foreground">
        Sessão de <span className="font-semibold text-foreground">{session.name}</span> ·{' '}
        {session.email}. As preferências abaixo ficam salvas neste navegador.
      </p>
      <div className="rounded-2xl border border-border bg-card/50 p-6 sm:p-8">
        <PreferencesPanel />
      </div>
    </main>
  );
}

function SettingsFallback() {
  return (
    <main className="max-w-2xl mx-auto px-6 py-12 flex items-center justify-center min-h-[200px]">
      <LoadingDots size="lg" className="text-muted-foreground" />
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
