import Link from 'next/link';

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-cloud-dancer/85 backdrop-blur-md">
      <div className="max-w-2xl mx-auto px-6 h-14 flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="font-body text-lg font-semibold text-foreground hover:text-brand-green transition-colors duration-200"
        >
          Alice
        </Link>

        {/* Nav */}
        <nav className="flex items-center gap-6 font-ui text-sm">
          <Link
            href="/blog"
            className="text-muted-foreground hover:text-foreground transition-colors duration-200"
          >
            Artigos
          </Link>
          <Link
            href="/"
            className="text-muted-foreground hover:text-foreground transition-colors duration-200"
          >
            Sobre
          </Link>
        </nav>
      </div>
    </header>
  );
}
