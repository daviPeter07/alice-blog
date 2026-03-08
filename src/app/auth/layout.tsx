import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Autenticação',
  description: 'Faça login ou crie sua conta para comentar e interagir no blog da Alice.',
};

export default function AuthLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="min-h-[calc(100vh-3.5rem)] flex flex-col items-center justify-center bg-cloud-dancer">
      {children}
    </div>
  );
}
