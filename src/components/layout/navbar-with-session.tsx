import { getSession } from '@/lib/auth';
import { Navbar } from './navbar';

interface NavbarWithSessionProps {
  showThemeToggle?: boolean;
}

export async function NavbarWithSession({ showThemeToggle = false }: NavbarWithSessionProps) {
  const session = await getSession().catch(() => null);
  return (
    <Navbar
      showThemeToggle={showThemeToggle}
      user={session ? { name: session.name, email: session.email, role: session.role } : null}
    />
  );
}
