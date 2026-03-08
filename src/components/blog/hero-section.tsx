import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { LandingSection } from '@/components/blog/landing-section';

const HERO_IMAGE_WIDTH = 600;
const HERO_IMAGE_HEIGHT = 600;

export function HeroSection() {
  return (
    <LandingSection variant="hero" layout="text-left">
      <section
        className="flex min-h-[calc(100vh-3.5rem)] flex-col justify-center px-6 md:py-12"
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
            className="animate-fade-up font-heading text-4xl sm:text-5xl md:text-6xl font-semibold text-foreground leading-[1.1]"
            style={{ animationDelay: '80ms' }}
          >
            Um espaço
            <br />
            para ideias.
          </h1>

          <p
            className="animate-fade-up font-ui text-muted-foreground text-lg leading-relaxed max-w-md"
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
      <div
        className="hidden md:flex items-center justify-center min-h-[calc(100vh-3.5rem)] px-6"
        aria-hidden
      >
        <Image
          src="/menina-gato-livro-removebg.png"
          alt=""
          width={HERO_IMAGE_WIDTH}
          height={HERO_IMAGE_HEIGHT}
          className="object-contain"
          style={{ maxWidth: HERO_IMAGE_WIDTH, maxHeight: HERO_IMAGE_HEIGHT }}
          priority
        />
      </div>
    </LandingSection>
  );
}
