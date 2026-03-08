import type { Metadata } from 'next';
import Link from 'next/link';
import { RegisterForm } from './register-form';
import { MessageCircle, Heart, BookOpen } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Criar conta',
  description: 'Cadastre-se para comentar e interagir no blog da Alice.',
};

export default function RegisterPage() {
  return (
    <main className="w-full px-6 py-12 sm:py-16">
      <div className="mx-auto max-w-6xl flex flex-col lg:flex-row-reverse lg:items-center lg:gap-16">
        {/* Formulário à esquerda em desktop (primeiro em mobile) */}
        <div className="flex-1 flex justify-center lg:justify-start">
          <RegisterForm />
        </div>

        {/* Painel direito: por que criar conta (layout diferente do login) */}
        <div className="hidden lg:flex lg:flex-1 lg:flex-col lg:justify-center lg:max-w-sm lg:pl-8">
          <p className="font-ui text-xs tracking-[0.2em] uppercase text-muted-foreground mb-4">
            Por que criar conta?
          </p>
          <ul className="space-y-5">
            <li className="flex gap-4">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-landing-sage text-brand-green">
                <MessageCircle size={20} aria-hidden />
              </span>
              <div>
                <span className="font-ui text-sm font-medium text-foreground">Comentar</span>
                <p className="font-ui text-sm text-muted-foreground mt-0.5">
                  Participe das conversas nos artigos.
                </p>
              </div>
            </li>
            <li className="flex gap-4">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-landing-warm text-brand-brown">
                <Heart size={20} aria-hidden />
              </span>
              <div>
                <span className="font-ui text-sm font-medium text-foreground">Curtir</span>
                <p className="font-ui text-sm text-muted-foreground mt-0.5">
                  Marque os textos que você gostou.
                </p>
              </div>
            </li>
            <li className="flex gap-4">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-landing-cream border border-border text-foreground">
                <BookOpen size={20} aria-hidden />
              </span>
              <div>
                <span className="font-ui text-sm font-medium text-foreground">Acompanhar</span>
                <p className="font-ui text-sm text-muted-foreground mt-0.5">
                  Sua identidade em todos os comentários.
                </p>
              </div>
            </li>
          </ul>
          <Link
            href="/"
            className="mt-8 font-body text-sm font-medium text-brand-green hover:underline"
          >
            ← Voltar ao blog
          </Link>
        </div>
      </div>
    </main>
  );
}
