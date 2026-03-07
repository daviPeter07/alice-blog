import type { Metadata } from 'next';
import { Suspense } from 'react';
import { Inter, Lora } from 'next/font/google';
import { Toaster } from '@/components/ui/sonner';
import { ThemeProvider } from '@/components/providers/theme-provider';
import { Header } from '@/components/layout/header';
import { HeaderWithSession } from '@/components/layout/header-with-session';
import { Footer } from '@/components/layout/footer';
import './globals.css';

const LANDING_NAV_ANCHORS = [
  { href: '/#destaque', label: 'Destaques' },
  { href: '/#categorias', label: 'Categorias' },
] as const;

const FOOTER_TOPICS = [
  { href: '/blog', label: 'Blog' },
  { href: '/#destaque', label: 'Destaques' },
  { href: '/#categorias', label: 'Categorias' },
] as const;

const lora = Lora({
  variable: '--font-lora',
  subsets: ['latin'],
  display: 'swap',
});

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'Alice',
    template: '%s — Alice',
  },
  description:
    'Reflexões sobre filosofia, história, crítica social e a condição humana. Por Alice.',
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR" className={`${lora.variable} ${inter.variable}`} suppressHydrationWarning>
      <body className="antialiased min-h-screen flex flex-col" suppressHydrationWarning>
        <ThemeProvider>
          <Suspense
            fallback={
              <Header
                navAnchors={[...LANDING_NAV_ANCHORS]}
                showThemeToggle
                showLoginButton
                user={null}
              />
            }
          >
            <HeaderWithSession navAnchors={[...LANDING_NAV_ANCHORS]} showThemeToggle />
          </Suspense>
          <div className="flex-1">{children}</div>
          <Footer
            topics={[...FOOTER_TOPICS]}
            contactEmail="alice@example.com"
            contactLabel="Entrar em contato"
          />
          <Toaster position="bottom-right" closeButton={false} />
        </ThemeProvider>
      </body>
    </html>
  );
}
