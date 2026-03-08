'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { User, Menu, X } from 'lucide-react';
import { ConfirmModal } from '@/components/ui/confirm-modal';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { logout } from '@/actions/auth';

export interface NavAnchor {
  href: string;
  label: string;
}

export interface NavbarUser {
  name: string;
  email?: string;
  role?: 'ADMIN' | 'READER';
}

export interface NavbarProps {
  navAnchors: NavAnchor[];
  showThemeToggle?: boolean;
  user?: NavbarUser | null;
  logo?: React.ReactNode;
}

function NavLink({ href, label, isActive }: NavAnchor & { isActive?: boolean }) {
  const baseClass = 'font-ui text-sm transition-colors duration-200 flex items-center h-8';
  const activeClass = isActive
    ? 'text-foreground font-medium underline decoration-brand-green decoration-2 underline-offset-4'
    : 'text-muted-foreground hover:text-foreground no-underline';
  const className = `${baseClass} ${activeClass}`;
  if (href.startsWith('#')) {
    return (
      <a href={href} className={className}>
        {label}
      </a>
    );
  }
  return (
    <Link href={href} className={className}>
      {label}
    </Link>
  );
}

function getHashFromHref(href: string): string | null {
  const match = href.match(/#(.+)/);
  return match ? match[1] : null;
}

function useActiveSection() {
  const pathname = usePathname();
  const [activeSection, setActiveSection] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (pathname !== '/') return;
    const ids = ['destaque', 'categorias', 'personalizar', 'como-funciona'];
    const elements = ids.map((id) => document.getElementById(id)).filter(Boolean);
    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const id = entry.target.getAttribute('id');
          if (id) setActiveSection(id);
          break;
        }
      },
      { rootMargin: '-20% 0px -70% 0px', threshold: 0 }
    );
    elements.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, [pathname]);

  return { pathname, activeSection };
}

export function Navbar({ navAnchors, showThemeToggle = false, user = null, logo }: NavbarProps) {
  const { pathname, activeSection } = useActiveSection();
  const [dropdownOpen, setDropdownOpen] = React.useState(false);
  const [menuOpen, setMenuOpen] = React.useState(false);
  const [logoutModalOpen, setLogoutModalOpen] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  const isLinkActive = React.useCallback(
    (href: string) => {
      if (href === '/blog') return pathname === '/blog';
      const hash = getHashFromHref(href);
      return pathname === '/' && hash !== null && activeSection === hash;
    },
    [pathname, activeSection]
  );

  const handleLogout = React.useCallback(async () => {
    await logout();
    setLogoutModalOpen(false);
    setDropdownOpen(false);
  }, []);

  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setDropdownOpen(false);
        setMenuOpen(false);
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  React.useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  const defaultLogo = (
    <span className="font-heading text-lg font-semibold text-foreground hover:text-brand-green transition-colors duration-200">
      Alice
    </span>
  );

  const navContent = (
    <>
      {navAnchors.map((anchor) => (
        <NavLink
          key={anchor.href}
          href={anchor.href}
          label={anchor.label}
          isActive={isLinkActive(anchor.href)}
        />
      ))}
      <NavLink href="/blog" label="Artigos" isActive={isLinkActive('/blog')} />
    </>
  );

  const authContent = user ? (
    <div ref={dropdownRef} className="relative">
      <button
        type="button"
        onClick={() => setDropdownOpen((o) => !o)}
        className="flex items-center gap-2 font-ui text-sm text-muted-foreground hover:text-foreground transition-colors duration-200"
        aria-expanded={dropdownOpen}
        aria-haspopup="true"
      >
        <User className="size-4" aria-hidden />
        <span>{user.name}</span>
      </button>
      {dropdownOpen && (
        <div
          role="menu"
          aria-label="Menu do usuário"
          className="absolute right-0 top-full mt-2 min-w-[180px] rounded-lg border border-border bg-popover py-1 shadow-lg"
        >
          <Link
            href="/settings"
            role="menuitem"
            onClick={() => setDropdownOpen(false)}
            className="block px-4 py-2 font-ui text-sm text-foreground hover:bg-accent"
          >
            Configurações
          </Link>
          <button
            type="button"
            role="menuitem"
            onClick={() => setLogoutModalOpen(true)}
            className="w-full px-4 py-2 text-left font-ui text-sm text-foreground hover:bg-accent"
          >
            Sair
          </button>
        </div>
      )}
    </div>
  ) : (
    <div className="flex items-center gap-2 font-ui text-sm">
      <User className="size-4 text-muted-foreground" aria-hidden />
      <span className="text-muted-foreground">Seja bem-vindo</span>
      <span className="text-muted-foreground" aria-hidden>
        |
      </span>
      <Link
        href="/auth/login"
        className="font-semibold text-foreground hover:text-brand-green transition-colors duration-200"
      >
        Entre
      </Link>
      <span className="text-muted-foreground" aria-hidden>
        |
      </span>
      <Link
        href="/auth/register"
        className="font-semibold text-foreground hover:text-brand-green transition-colors duration-200"
      >
        Cadastre-se
      </Link>
    </div>
  );

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
          <Link href="/" className="shrink-0">
            {logo ?? defaultLogo}
          </Link>

          <div className="hidden md:flex items-center gap-5 shrink-0 ml-auto">
            <nav className="flex items-center gap-5" aria-label="Navegação principal">
              {navContent}
            </nav>
            <div className="flex items-center gap-3">
              {user?.role === 'ADMIN' && (
                <Link
                  href="/admin/posts"
                  className="flex items-center h-8 rounded-lg bg-brand-green px-3 font-medium text-white hover:bg-brand-green/90 transition-colors duration-200 text-sm font-ui"
                >
                  Lançar artigo
                </Link>
              )}
              {showThemeToggle && <ThemeToggle />}
              {authContent}
            </div>
          </div>

          <div className="flex md:hidden items-center gap-2">
            {showThemeToggle && <ThemeToggle />}
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-label="Abrir menu"
              className="flex h-9 w-9 items-center justify-center rounded-md border border-border bg-transparent text-foreground hover:bg-accent transition-colors"
            >
              <Menu className="size-5" aria-hidden />
            </button>
          </div>
        </div>
      </header>

      {menuOpen && (
        <div className="fixed inset-0 z-40 md:hidden" aria-hidden>
          <button
            type="button"
            onClick={() => setMenuOpen(false)}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            aria-label="Fechar menu"
          />
          <div className="absolute right-0 top-0 h-full w-[min(280px,85vw)] bg-popover border-l border-border shadow-xl flex flex-col pt-16 px-4 gap-6 animate-in slide-in-from-right duration-200">
            <button
              type="button"
              onClick={() => setMenuOpen(false)}
              className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-md text-foreground hover:bg-accent"
              aria-label="Fechar menu"
            >
              <X className="size-5" aria-hidden />
            </button>
            <nav className="flex flex-col gap-4" aria-label="Navegação principal">
              {navAnchors.map((anchor) => (
                <div key={anchor.href} onClick={() => setMenuOpen(false)}>
                  <NavLink
                    href={anchor.href}
                    label={anchor.label}
                    isActive={isLinkActive(anchor.href)}
                  />
                </div>
              ))}
              <div onClick={() => setMenuOpen(false)}>
                <NavLink href="/blog" label="Artigos" isActive={isLinkActive('/blog')} />
              </div>
            </nav>
            <div className="flex flex-col gap-4 pt-4 border-t border-border">
              {user?.role === 'ADMIN' && (
                <Link
                  href="/admin/posts"
                  onClick={() => setMenuOpen(false)}
                  className="rounded-lg bg-brand-green px-3 py-2 font-medium text-white hover:bg-brand-green/90 text-sm font-ui text-center"
                >
                  Lançar artigo
                </Link>
              )}
              {showThemeToggle && <ThemeToggle />}
              {user ? (
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2 font-ui text-sm text-muted-foreground">
                    <User className="size-4" aria-hidden />
                    <span>{user.name}</span>
                  </div>
                  <Link
                    href="/settings"
                    onClick={() => setMenuOpen(false)}
                    className="font-ui text-sm text-foreground hover:text-brand-green"
                  >
                    Configurações
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      setMenuOpen(false);
                      setLogoutModalOpen(true);
                    }}
                    className="font-ui text-sm text-left text-foreground hover:text-brand-green"
                  >
                    Sair
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  <span className="font-ui text-sm text-muted-foreground">Seja bem-vindo</span>
                  <Link
                    href="/auth/login"
                    onClick={() => setMenuOpen(false)}
                    className="font-ui text-sm font-semibold text-foreground hover:text-brand-green"
                  >
                    Entre
                  </Link>
                  <Link
                    href="/auth/register"
                    onClick={() => setMenuOpen(false)}
                    className="font-ui text-sm font-semibold text-foreground hover:text-brand-green"
                  >
                    Cadastre-se
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <ConfirmModal
        open={logoutModalOpen}
        onOpenChange={setLogoutModalOpen}
        variant="confirm"
        title="Sair da conta"
        message="Tem certeza que deseja sair?"
        onConfirm={handleLogout}
      />
    </>
  );
}
