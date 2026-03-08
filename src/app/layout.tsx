import type { Metadata } from 'next';
import { Suspense } from 'react';
import { Inter, Lora } from 'next/font/google';
import { Toaster } from '@/components/ui/sonner';
import { ThemeProvider } from '@/components/providers/theme-provider';
import { Navbar } from '@/components/layout/navbar';
import { NavbarWithSession } from '@/components/layout/navbar-with-session';
import { Footer } from '@/components/layout/footer';
import './globals.css';

const LANDING_NAV_ANCHORS = [
  { href: '/#destaque', label: 'Destaques' },
  { href: '/#categorias', label: 'Categorias' },
  { href: '/#personalizar', label: 'Personalizar' },
  { href: '/#como-funciona', label: 'Como funciona' },
] as const;

const FOOTER_TOPICS = [
  { href: '/blog', label: 'Blog' },
  { href: '/#destaque', label: 'Destaques' },
  { href: '/#categorias', label: 'Categorias' },
  { href: '/#personalizar', label: 'Personalizar' },
  { href: '/#como-funciona', label: 'Como funciona' },
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
            fallback={<Navbar navAnchors={[...LANDING_NAV_ANCHORS]} showThemeToggle user={null} />}
          >
            <NavbarWithSession navAnchors={[...LANDING_NAV_ANCHORS]} showThemeToggle />
          </Suspense>
          <div className="flex-1">{children}</div>
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
