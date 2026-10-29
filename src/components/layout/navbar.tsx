'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LogOut, Menu, PenLine, Settings, SlidersHorizontal, X } from 'lucide-react';
import { ConfirmModal } from '@/components/ui/confirm-modal';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { usePreferencesDialog } from '@/components/preferences/preferences-dialog';
import { logout } from '@/actions/auth';
import { getInitials } from '@/helpers';
import { NAV_ITEMS } from '@/lib/preferences';
import { cn } from '@/lib/utils';

export interface NavbarUser {
  name: string;
  email?: string;
  role?: 'ADMIN' | 'READER';
}

export interface NavbarProps {
  showThemeToggle?: boolean;
  user?: NavbarUser | null;
  logo?: React.ReactNode;
}

const SECTION_IDS = NAV_ITEMS.filter((i) => i.href.startsWith('/#')).map((i) => i.key);

const ICON_BUTTON_CLASS =
  'flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring';

function NavLink({
  href,
  label,
  isActive,
  className,
}: {
  href: string;
  label: string;
  isActive?: boolean;
  className?: string;
}) {
  return (
    <Link
      href={href}
      aria-current={isActive ? 'page' : undefined}
      className={cn(
        'flex h-8 items-center rounded-full px-3 font-ui text-sm transition-colors duration-200',
        isActive
          ? 'bg-brand-green/10 font-semibold text-brand-green theme-dark:bg-brand-green-light/20 theme-dark:text-foreground'
          : 'text-muted-foreground hover:text-foreground',
        className
      )}
    >
      {label}
    </Link>
  );
}

function useActiveSection() {
  const pathname = usePathname();
  const [activeSection, setActiveSection] = React.useState<string | null>(null);
  const ratiosRef = React.useRef<Record<string, number>>({});

  React.useEffect(() => {
    if (pathname !== '/') return;
    const elements = SECTION_IDS.map((id) => document.getElementById(id)).filter(Boolean);
    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const id = entry.target.getAttribute('id');
          if (!id) continue;
          ratiosRef.current[id] = entry.isIntersecting ? entry.intersectionRatio : 0;
        }
        const ratios = ratiosRef.current;
        let bestId: string | null = null;
        let bestRatio = 0;
        for (const id of SECTION_IDS) {
          const r = ratios[id] ?? 0;
          if (r > bestRatio) {
            bestRatio = r;
            bestId = id;
          }
        }
        setActiveSection(bestId);
      },
      { rootMargin: '-20% 0px -70% 0px', threshold: [0, 0.1, 0.25, 0.5, 0.75, 1] }
    );
    elements.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, [pathname]);

  return { pathname, activeSection };
}

function UserAvatar({ name, size = 'md' }: { name: string; size?: 'md' | 'lg' }) {
  return (
    <span
      className={cn(
        'flex shrink-0 items-center justify-center rounded-full bg-brand-green font-ui font-bold text-white',
        size === 'md' ? 'size-8 text-xs' : 'size-10 text-sm'
      )}
      aria-hidden
    >
      {getInitials(name) || '?'}
    </span>
  );
}

export function Navbar({ showThemeToggle = false, user = null, logo }: NavbarProps) {
  const { pathname, activeSection } = useActiveSection();
  const { openPreferences } = usePreferencesDialog();
  const [dropdownOpen, setDropdownOpen] = React.useState(false);
  const [menuOpen, setMenuOpen] = React.useState(false);
  const [logoutModalOpen, setLogoutModalOpen] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  const isLinkActive = React.useCallback(
    (href: string) => {
      if (href === '/blog') return pathname.startsWith('/blog');
      const hash = href.match(/#(.+)/)?.[1] ?? null;
      return pathname === '/' && hash !== null && activeSection === hash;
    },
    [pathname, activeSection]
  );

  const handleLogout = React.useCallback(async () => {
    await logout();
    setLogoutModalOpen(false);
    setDropdownOpen(false);
  }, []);

  const handleOpenPreferences = () => {
    setDropdownOpen(false);
    setMenuOpen(false);
    openPreferences();
  };

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
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  const defaultLogo = (
    <span className="font-heading text-lg font-semibold text-foreground hover:text-brand-green transition-colors duration-200">
      Alice
    </span>
  );

  const preferencesButton = (
    <button
      type="button"
      onClick={handleOpenPreferences}
      className={ICON_BUTTON_CLASS}
      aria-label="Personalizar aparência"
      title="Personalizar"
    >
      <SlidersHorizontal size={16} aria-hidden />
    </button>
  );

  const themeToggle = showThemeToggle && (
    <ThemeToggle className={ICON_BUTTON_CLASS} ariaLabel="Alternar tema claro/escuro" />
  );

  const userMenu = user && (
    <div ref={dropdownRef} className="relative">
      <button
        type="button"
        onClick={() => setDropdownOpen((o) => !o)}
        className="flex items-center rounded-full ring-offset-2 ring-offset-background transition hover:ring-2 hover:ring-brand-green/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        aria-expanded={dropdownOpen}
        aria-haspopup="menu"
        aria-label={`Menu de ${user.name}`}
      >
        <UserAvatar name={user.name} />
      </button>
      {dropdownOpen && (
        <div
          role="menu"
          aria-label="Menu do usuário"
          className="animate-in fade-in-0 zoom-in-95 absolute right-0 top-full mt-2 w-60 overflow-hidden rounded-xl border border-border bg-popover shadow-lg duration-150"
        >
          <div className="flex items-center gap-3 border-b border-border px-4 py-3">
            <UserAvatar name={user.name} size="lg" />
            <div className="min-w-0">
              <p className="truncate font-ui text-sm font-semibold text-foreground">{user.name}</p>
              {user.email && (
                <p className="truncate font-ui text-xs text-muted-foreground">{user.email}</p>
              )}
            </div>
          </div>
          <div className="py-1">
            <Link
              href="/settings"
              role="menuitem"
              onClick={() => setDropdownOpen(false)}
              className="flex items-center gap-2.5 px-4 py-2 font-ui text-sm text-foreground hover:bg-accent"
            >
              <Settings size={16} className="text-muted-foreground" aria-hidden />
              Configurações
            </Link>
            <button
              type="button"
              role="menuitem"
              onClick={handleOpenPreferences}
              className="flex w-full items-center gap-2.5 px-4 py-2 text-left font-ui text-sm text-foreground hover:bg-accent"
            >
              <SlidersHorizontal size={16} className="text-muted-foreground" aria-hidden />
              Personalizar
            </button>
          </div>
          <div className="border-t border-border py-1">
            <button
              type="button"
              role="menuitem"
              onClick={() => setLogoutModalOpen(true)}
              className="flex w-full items-center gap-2.5 px-4 py-2 text-left font-ui text-sm text-destructive transition-colors hover:bg-destructive/10"
            >
              <LogOut size={16} aria-hidden />
              Sair
            </button>
          </div>
        </div>
      )}
    </div>
  );

  const guestActions = (
    <div className="flex items-center gap-1">
      <Link
        href="/auth/login"
        className="rounded-full px-3 py-1.5 font-ui text-sm font-semibold text-foreground transition-colors hover:text-brand-green"
      >
        Entrar
      </Link>
      <Link
        href="/auth/register"
        className="rounded-full bg-brand-green px-4 py-1.5 font-ui text-sm font-semibold text-white shadow-sm transition-colors hover:bg-brand-green/90"
      >
        Criar conta
      </Link>
    </div>
  );

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/90 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
          <Link href="/" className="shrink-0">
            {logo ?? defaultLogo}
          </Link>

          <nav
            className="hidden lg:flex items-center gap-0.5 ml-auto"
            aria-label="Navegação principal"
          >
            {NAV_ITEMS.map((item) => (
              <span key={item.key} data-nav-key={item.key} className="contents">
                <NavLink href={item.href} label={item.label} isActive={isLinkActive(item.href)} />
              </span>
            ))}
          </nav>

          <div className="hidden lg:flex items-center gap-1 shrink-0">
            <span className="mx-2 h-5 w-px bg-border" aria-hidden />
            {user?.role === 'ADMIN' && (
              <Link
                href="/admin/posts"
                className={ICON_BUTTON_CLASS}
                aria-label="Lançar artigo"
                title="Lançar artigo"
              >
                <PenLine size={16} aria-hidden />
              </Link>
            )}
            {preferencesButton}
            {themeToggle}
            <span className="ml-1">{user ? userMenu : guestActions}</span>
          </div>

          <div className="flex lg:hidden items-center gap-1">
            {themeToggle}
            <button
              type="button"
              onClick={() => setMenuOpen((o) => !o)}
              aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'}
              aria-expanded={menuOpen}
              className={ICON_BUTTON_CLASS}
            >
              {menuOpen ? <X size={20} aria-hidden /> : <Menu size={20} aria-hidden />}
            </button>
          </div>
        </div>
      </header>

      {menuOpen && (
        <div className="fixed inset-0 z-60 lg:hidden">
          <button
            type="button"
            onClick={() => setMenuOpen(false)}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            aria-label="Fechar menu"
          />
          <div className="absolute right-0 top-0 h-full w-[min(300px,85vw)] bg-popover border-l border-border shadow-xl flex flex-col animate-in slide-in-from-right duration-200">
            <div className="flex items-center justify-between border-b border-border px-5 h-14">
              <span className="font-heading text-lg font-semibold text-foreground">Menu</span>
              <div className="flex items-center gap-1">
                {themeToggle}
                <button
                  type="button"
                  onClick={() => setMenuOpen(false)}
                  className={ICON_BUTTON_CLASS}
                  aria-label="Fechar menu"
                >
                  <X size={20} aria-hidden />
                </button>
              </div>
            </div>

            {user && (
              <div className="flex items-center gap-3 border-b border-border px-5 py-4">
                <UserAvatar name={user.name} size="lg" />
                <div className="min-w-0">
                  <p className="truncate font-ui text-sm font-semibold text-foreground">
                    {user.name}
                  </p>
                  {user.email && (
                    <p className="truncate font-ui text-xs text-muted-foreground">{user.email}</p>
                  )}
                </div>
              </div>
            )}

            <nav className="flex flex-col gap-1 px-3 py-4" aria-label="Navegação principal">
              {NAV_ITEMS.map((item) => (
                <div key={item.key} data-nav-key={item.key} onClick={() => setMenuOpen(false)}>
                  <NavLink
                    href={item.href}
                    label={item.label}
                    isActive={isLinkActive(item.href)}
                    className="h-10 w-full rounded-lg"
                  />
                </div>
              ))}
            </nav>

            <div className="mt-auto flex flex-col gap-1 border-t border-border px-3 py-4">
              {user?.role === 'ADMIN' && (
                <Link
                  href="/admin/posts"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 font-ui text-sm text-foreground hover:bg-accent"
                >
                  <PenLine size={16} className="text-muted-foreground" aria-hidden />
                  Lançar artigo
                </Link>
              )}
              <button
                type="button"
                onClick={handleOpenPreferences}
                className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-left font-ui text-sm text-foreground hover:bg-accent"
              >
                <SlidersHorizontal size={16} className="text-muted-foreground" aria-hidden />
                Personalizar
              </button>
              {user ? (
                <>
                  <Link
                    href="/settings"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 font-ui text-sm text-foreground hover:bg-accent"
                  >
                    <Settings size={16} className="text-muted-foreground" aria-hidden />
                    Configurações
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      setMenuOpen(false);
                      setLogoutModalOpen(true);
                    }}
                    className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-left font-ui text-sm text-destructive hover:bg-destructive/10"
                  >
                    <LogOut size={16} aria-hidden />
                    Sair
                  </button>
                </>
              ) : (
                <div className="mt-2 grid grid-cols-2 gap-2">
                  <Link
                    href="/auth/login"
                    onClick={() => setMenuOpen(false)}
                    className="rounded-full border border-border py-2 text-center font-ui text-sm font-semibold text-foreground hover:bg-accent"
                  >
                    Entrar
                  </Link>
                  <Link
                    href="/auth/register"
                    onClick={() => setMenuOpen(false)}
                    className="rounded-full bg-brand-green py-2 text-center font-ui text-sm font-semibold text-white hover:bg-brand-green/90"
                  >
                    Criar conta
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
