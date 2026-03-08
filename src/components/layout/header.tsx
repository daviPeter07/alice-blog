import Link from 'next/link';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { logout } from '@/actions/auth';
import type { NavAnchor } from '@/types/landing';

export interface HeaderProps {
  navAnchors?: NavAnchor[];
  showLoginButton?: boolean;
  showThemeToggle?: boolean;
  user?: { name: string; role?: 'ADMIN' | 'READER' } | null;
}

export function Header({
  navAnchors = [],
  showLoginButton,
  showThemeToggle = false,
  user,
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur-md">
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
          {user?.role === 'ADMIN' && (
            <Link
              href="/admin/posts"
              className="rounded-lg bg-brand-green px-3 py-1.5 font-medium text-white hover:bg-brand-green/90 transition-colors duration-200 text-sm"
            >
              Lançar artigo
            </Link>
          )}
          {showThemeToggle && <ThemeToggle />}
          {showLoginButton && user && (
            <div className="flex items-center gap-3">
              <span className="text-muted-foreground text-xs">
                Logado como <strong className="text-foreground">{user.name}</strong>
              </span>
              <form action={logout}>
                <button
                  type="submit"
                  className="font-ui text-sm text-muted-foreground hover:text-foreground transition-colors duration-200"
                >
                  Sair
                </button>
              </form>
            </div>
          )}
          {showLoginButton && !user && (
            <Link
              href="/auth/login"
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
