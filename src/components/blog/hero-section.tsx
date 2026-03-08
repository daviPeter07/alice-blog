import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { LandingSection } from '@/components/blog/landing-section';

export function HeroSection() {
  return (
    <LandingSection variant="hero">
      <section
        className="flex min-h-[calc(100vh-3.5rem)] flex-col items-center justify-center px-6 text-center"
        aria-label="Apresentação"
      >
        <div className="space-y-7 max-w-xl">
          <p
            className="animate-fade-up font-ui text-xs tracking-[0.25em] uppercase text-muted-foreground select-none"
            style={{ animationDelay: '0ms' }}
          >
            por Alice
          </p>

          <h1
            className="animate-fade-up font-body text-5xl sm:text-6xl font-semibold text-foreground leading-[1.1]"
            style={{ animationDelay: '80ms' }}
          >
            Um espaço
            <br />
            para ideias.
          </h1>

          <p
            className="animate-fade-up font-ui text-muted-foreground text-lg leading-relaxed max-w-sm mx-auto"
            style={{ animationDelay: '160ms' }}
          >
            O que tenho escrito — textos, ensaios e reflexões sobre o que me move.
          </p>

          <div className="animate-fade-up pt-2" style={{ animationDelay: '240ms' }}>
            <Button asChild size="lg" variant="outline">
              <Link href="/blog">Ler os artigos</Link>
            </Button>
          </div>
        </div>
      </section>
    </LandingSection>
  );
}
