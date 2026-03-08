import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { LandingSection } from '@/components/blog/landing-section';
import { TypewriterText } from '@/components/blog/typewriter-text';

const HERO_IMAGE_WIDTH = 500;
const HERO_IMAGE_HEIGHT = 500;

export function HeroSection() {
  return (
    <LandingSection variant="hero" layout="text-left">
      <section
        className="flex min-h-[calc(100vh-3.5rem)] flex-col justify-center px-6 md:py-12"
        aria-label="Apresentação"
      >
        <div className="space-y-7 max-w-3xl">
          <p
            className="animate-fade-up font-ui text-xs tracking-[0.25em] uppercase text-muted-foreground select-none font-bold"
            style={{ animationDelay: '0ms' }}
          >
            por Alice
          </p>

          <TypewriterText
            phrases={[
              'Um espaço \npara ideias.',
              'Um espaço \npara reflexões.',
              'Um espaço \npara histórias.',
            ]}
            speed={100}
            startDelay={400}
            loop
            pauseBeforeRestart={2500}
            className="font-heading text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold text-foreground leading-[1.1]"
          />

          <p
            className="animate-fade-up font-ui text-muted-foreground text-lg leading-relaxed max-w-md"
            style={{ animationDelay: '160ms' }}
          >
            O que tenho escrito — textos, dicas e reflexões sobre o que me move.
          </p>

          <div className="animate-fade-up pt-2" style={{ animationDelay: '240ms' }}>
            <Button
              asChild
              size="lg"
              className="bg-brand-green hover:bg-brand-green/90 text-white font-semibold shadow-md hover:shadow-lg transition-shadow px-8 py-3 text-base"
            >
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
