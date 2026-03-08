import Link from 'next/link';
import { Heart, Coffee } from 'lucide-react';
import type { NavAnchor } from '@/types/landing';

export interface FooterProps {
  topics?: NavAnchor[];
  contactEmail?: string;
  contactLabel?: string;
}

const currentYear = new Date().getFullYear();

export function Footer({
  topics = [],
  contactEmail,
  contactLabel = 'Entrar em contato',
}: FooterProps) {
  return (
    <footer
      className="border-t border-border bg-cafe-mocha theme-dark:bg-muted/30"
      aria-label="Rodapé"
    >
      <div className="max-w-6xl mx-auto px-6 py-14 sm:py-16">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-12">
          {/* Brand — inspirado no footer do Davi Peterson */}
          <div className="lg:col-span-2">
            <Link
              href="/"
              className="font-heading text-xl font-semibold text-foreground hover:text-brand-green transition-colors inline-block mb-3"
            >
              Alice
            </Link>
            <p className="font-ui text-base text-muted-foreground leading-relaxed max-w-sm">
              Um espaço para ideias, reflexões e histórias. Textos, ensaios e o que me move.
            </p>
          </div>

          {/* Links Rápidos */}
          {topics.length > 0 && (
            <div>
              <h3 className="font-heading text-base font-semibold text-foreground mb-4 uppercase tracking-wider">
                Navegar
              </h3>
              <nav className="flex flex-col gap-2" aria-label="Links do rodapé">
                {topics.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="font-ui text-base text-muted-foreground hover:text-brand-green transition-colors"
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
            </div>
          )}

          {/* Contato */}
          {contactEmail && (
            <div>
              <h3 className="font-heading text-base font-semibold text-foreground mb-4 uppercase tracking-wider">
                Contato
              </h3>
              <a
                href={`mailto:${contactEmail}`}
                className="font-ui text-base text-muted-foreground hover:text-brand-green transition-colors underline underline-offset-2"
              >
                {contactLabel}
              </a>
            </div>
          )}
        </div>

        {/* Copyright — inspirado no footer do Davi Peterson: Feito com ♥ e café */}
        <div className="mt-14 pt-8 border-t border-border/60">
          <p className="font-ui text-sm text-muted-foreground/90 text-center flex flex-wrap items-center justify-center gap-x-1 gap-y-0.5">
            Feito com{' '}
            <Heart
              size={14}
              className="inline-block text-brand-brown theme-dark:text-brand-brown-light align-middle"
              aria-hidden
            />{' '}
            e{' '}
            <Coffee
              size={14}
              className="inline-block text-brand-brown theme-dark:text-brand-brown-light align-middle"
              aria-hidden
            />{' '}
            por{' '}
            <a
              href="https://davi-peterson.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2 hover:text-brand-green transition-colors"
            >
              Davi Peterson
            </a>
            {' · '}© {currentYear} Alice-Blog
          </p>
        </div>
      </div>
    </footer>
  );
}
