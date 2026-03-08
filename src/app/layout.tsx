import type { Metadata } from 'next';
import { Suspense } from 'react';
import { Nunito, Nunito_Sans, Bricolage_Grotesque } from 'next/font/google';
import { Toaster } from '@/components/ui/sonner';
import { ThemeProvider } from '@/components/providers/theme-provider';
import { NavbarWithSession } from '@/components/layout/navbar-with-session';
import { Footer } from '@/components/layout/footer';
import './globals.css';

const LANDING_NAV_ANCHORS = [
  { href: '/#destaque', label: 'Destaques' },
  { href: '/#quem-sou-eu', label: 'Quem sou eu' },
  { href: '/#categorias', label: 'Categorias' },
  { href: '/#personalizar', label: 'Personalizar' },
  { href: '/#como-funciona', label: 'Como funciona' },
] as const;

/** Fallback estático (sem client components) para não acessar dados que bloqueiam. */
function LayoutFallback() {
  return (
    <>
      <header
        className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur-md"
        aria-hidden
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center">
          <a
            href="/"
            className="font-heading text-lg font-semibold text-foreground hover:text-brand-green transition-colors duration-200"
          >
            Alice
          </a>
        </div>
      </header>
      <div className="flex-1 flex items-center justify-center min-h-[50vh]">
        <p className="font-ui text-sm text-muted-foreground">Carregando…</p>
      </div>
    </>
  );
}

const FOOTER_TOPICS = [
  { href: '/blog', label: 'Blog' },
  { href: '/#destaque', label: 'Destaques' },
  { href: '/#quem-sou-eu', label: 'Quem sou eu' },
  { href: '/#categorias', label: 'Categorias' },
  { href: '/#personalizar', label: 'Personalizar' },
  { href: '/#como-funciona', label: 'Como funciona' },
] as const;

const nunito = Nunito({
  variable: '--font-nunito',
  subsets: ['latin'],
  display: 'swap',
  weight: ['400', '500', '600', '700'],
});

const nunitoSans = Nunito_Sans({
  variable: '--font-nunito-sans',
  subsets: ['latin'],
  display: 'swap',
  weight: ['700'],
});

const bricolage = Bricolage_Grotesque({
  variable: '--font-bricolage',
  subsets: ['latin'],
  display: 'swap',
  weight: ['400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: {
    default: 'Alice',
    template: '%s — Alice',
  },
  description:
    'Reflexões sobre filosofia, história, crítica social e a condição humana. Por Alice.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="pt-BR"
      className={`${nunito.variable} ${nunitoSans.variable} ${bricolage.variable}`}
      suppressHydrationWarning
    >
      <body className="antialiased min-h-screen flex flex-col" suppressHydrationWarning>
        <ThemeProvider>
          <Suspense fallback={<LayoutFallback />}>
            <NavbarWithSession navAnchors={[...LANDING_NAV_ANCHORS]} showThemeToggle />
            <div className="flex-1">{children}</div>
          </Suspense>
          <Footer
            topics={[...FOOTER_TOPICS]}
            contactEmail={process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? 'alice@example.com'}
            contactLabel="Entrar em contato"
          />
          <Toaster position="bottom-right" closeButton={false} />
        </ThemeProvider>
      </body>
    </html>
  );
}
