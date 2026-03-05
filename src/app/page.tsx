import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function HomePage() {
  return (
    <main className="flex min-h-[calc(100vh-3.5rem)] flex-col items-center justify-center px-6 text-center">
      <div className="space-y-7 max-w-xl">
        {/* Linha superior */}
        <p
          className="animate-fade-up font-ui text-xs tracking-[0.25em] uppercase text-muted-foreground select-none"
          style={{ animationDelay: '0ms' }}
        >
          ensaios por Alice
        </p>

        {/* Título principal */}
        <h1
          className="animate-fade-up font-body text-5xl sm:text-6xl font-semibold text-foreground leading-[1.1]"
          style={{ animationDelay: '80ms' }}
        >
          Filosofia,
          <br />
          história e<br className="sm:hidden" /> crítica social.
        </h1>

        {/* Subtítulo */}
        <p
          className="animate-fade-up font-ui text-muted-foreground text-lg leading-relaxed max-w-sm mx-auto"
          style={{ animationDelay: '160ms' }}
        >
          Reflexões sobre a condição humana, o peso das ideias e o que a história ainda tem a nos
          dizer.
        </p>

        {/* CTA */}
        <div className="animate-fade-up pt-2" style={{ animationDelay: '240ms' }}>
          <Button asChild size="lg" variant="outline">
            <Link href="/blog">Ler os artigos</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
