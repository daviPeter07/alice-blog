import type { Metadata } from 'next';
import Link from 'next/link';
import { LoginForm } from './login-form';

export const metadata: Metadata = {
  title: 'Entrar',
  description: 'Faça login para comentar e interagir no blog da Alice.',
};

export default function LoginPage() {
  return (
    <main className="w-full px-6 py-12 sm:py-16">
      <div className="mx-auto max-w-6xl flex flex-col lg:flex-row lg:items-center lg:gap-16">
        {/* Painel esquerdo: marca + frase (layout split) */}
        <div className="hidden lg:flex lg:flex-1 lg:flex-col lg:justify-center lg:max-w-md">
          <Link
            href="/"
            className="font-body text-xl font-semibold text-foreground hover:text-brand-green transition-colors mb-8"
          >
            Alice
          </Link>
          <p className="font-body text-2xl sm:text-3xl text-foreground leading-snug">
            Um espaço para ideias. Faça login para comentar e participar das conversas.
          </p>
          <div className="mt-8 h-px w-16 bg-brand-brown/30" aria-hidden />
        </div>

        {/* Formulário à direita (ou centralizado em mobile) */}
        <div className="flex-1 flex justify-center lg:justify-end">
          <LoginForm />
        </div>
      </div>
    </main>
  );
}
