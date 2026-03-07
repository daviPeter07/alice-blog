import Link from 'next/link';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import type { NavAnchor } from '@/types/landing';

export interface HeaderProps {
  navAnchors?: NavAnchor[];
  showLoginButton?: boolean;
  showThemeToggle?: boolean;
  user?: { name: string } | null;
}

export function Header({
  navAnchors = [],
  showLoginButton,
  showThemeToggle = false,
  user,
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-cloud-dancer/85 backdrop-blur-md">
      <div className="max-w-2xl mx-auto px-6 h-14 flex items-center justify-between">
        <Link
          href="/"
          className="font-body text-lg font-semibold text-foreground hover:text-brand-green transition-colors duration-200"
        >
          Alice
        </Link>

        <nav className="flex items-center gap-6 font-ui text-sm" aria-label="Navegação principal">
          {navAnchors.length > 0 &&
            navAnchors.map((anchor) => {
              const isHash = anchor.href.startsWith('#');
              if (isHash) {
                return (
                  <a
                    key={anchor.href}
                    href={anchor.href}
                    className="text-muted-foreground hover:text-foreground transition-colors duration-200"
                  >
                    {anchor.label}
                  </a>
                );
              }
              return (
                <Link
                  key={anchor.href}
                  href={anchor.href}
                  className="text-muted-foreground hover:text-foreground transition-colors duration-200"
                >
                  {anchor.label}
                </Link>
              );
            })}
          <Link
            href="/blog"
            className="text-muted-foreground hover:text-foreground transition-colors duration-200"
          >
            Artigos
          </Link>
          {showThemeToggle && <ThemeToggle />}
          {showLoginButton && !user && (
            <Link
              href="/login"
              className="text-muted-foreground hover:text-foreground transition-colors duration-200"
            >
              Login
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
