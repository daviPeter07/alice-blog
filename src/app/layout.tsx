import type { Metadata } from 'next';
import { Inter, Lora } from 'next/font/google';
import { Toaster } from 'sonner';
import { Header } from '@/components/layout/header';
import './globals.css';

const LANDING_NAV_ANCHORS = [
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

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR" className={`${lora.variable} ${inter.variable}`} data-theme="light">
      <body className="antialiased min-h-screen flex flex-col">
        <Header navAnchors={[...LANDING_NAV_ANCHORS]} />
        <div className="flex-1">{children}</div>
        <Toaster position="top-center" richColors closeButton />
      </body>
    </html>
  );
}
