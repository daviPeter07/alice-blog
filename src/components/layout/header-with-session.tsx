import { getSession } from '@/lib/auth';
import { Header } from './header';
import type { NavAnchor } from '@/types/landing';

interface HeaderWithSessionProps {
  navAnchors?: NavAnchor[];
  showThemeToggle?: boolean;
}

export async function HeaderWithSession({
  navAnchors = [],
  showThemeToggle = false,
}: HeaderWithSessionProps) {
  const session = await getSession().catch(() => null);
  return (
    <Header
      navAnchors={navAnchors}
      showThemeToggle={showThemeToggle}
      showLoginButton
      user={session ? { name: session.name, role: session.role } : null}
    />
  );
}
