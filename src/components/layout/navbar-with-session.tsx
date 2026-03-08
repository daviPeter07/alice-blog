import { getSession } from '@/lib/auth';
import { Navbar } from './navbar';
import type { NavAnchor } from '@/types/landing';

interface NavbarWithSessionProps {
  navAnchors?: NavAnchor[];
  showThemeToggle?: boolean;
}

export async function NavbarWithSession({
  navAnchors = [],
  showThemeToggle = false,
}: NavbarWithSessionProps) {
  const session = await getSession().catch(() => null);
  return (
    <Navbar
      navAnchors={navAnchors}
      showThemeToggle={showThemeToggle}
      user={session ? { name: session.name, email: session.email, role: session.role } : null}
    />
  );
}
