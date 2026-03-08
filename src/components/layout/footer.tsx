import Link from 'next/link';
import type { NavAnchor } from '@/types/landing';

export interface FooterProps {
  topics?: NavAnchor[];
  contactEmail?: string;
  contactLabel?: string;
}

export function Footer({
  topics = [],
  contactEmail,
  contactLabel = 'Entrar em contato',
}: FooterProps) {
  return (
    <footer className="py-10 px-6 border-t border-border bg-background/40" aria-label="Rodapé">
      <div className="max-w-2xl mx-auto font-ui text-sm">
        {topics.length > 0 && (
          <nav className="flex flex-wrap gap-6 mb-6" aria-label="Links do rodapé">
            {topics.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        )}
        {contactEmail && (
          <p className="text-muted-foreground">
            <a
              href={`mailto:${contactEmail}`}
              className="hover:text-foreground transition-colors underline underline-offset-2"
            >
              {contactLabel}
            </a>
          </p>
        )}
      </div>
    </footer>
  );
}
