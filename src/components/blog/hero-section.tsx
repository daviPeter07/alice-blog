import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LandingSection } from '@/components/blog/landing-section';
import { TypewriterText } from '@/components/blog/typewriter-text';

const HERO_IMAGE_WIDTH = 560;
const HERO_IMAGE_HEIGHT = 560;

export function HeroSection() {
  return (
    <LandingSection variant="hero" layout="text-left" className="relative overflow-hidden">
      <section
        className="flex flex-col justify-center px-6 pt-16 pb-6 lg:min-h-[calc(100vh-3.5rem)] lg:py-12"
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
            highlightClassName="text-brand-green theme-dark:text-brand-green-light"
          />

          <p
            className="animate-fade-up font-ui text-muted-foreground text-lg leading-relaxed max-w-md"
            style={{ animationDelay: '160ms' }}
          >
            O que tenho escrito — textos, dicas e reflexões sobre o que me move.
          </p>

          <div
            className="animate-fade-up flex flex-wrap items-center gap-3 pt-2"
            style={{ animationDelay: '240ms' }}
          >
            <Button
              asChild
              size="lg"
              className="group bg-brand-green hover:bg-brand-green/90 text-white font-semibold shadow-md hover:shadow-lg transition-shadow px-8 py-3 text-base"
            >
              <Link href="/blog">
                Ler os artigos
                <ArrowRight
                  className="size-4 transition-transform group-hover:translate-x-0.5"
                  aria-hidden
                />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-brand-brown/25 bg-transparent font-semibold text-foreground hover:border-brand-green/40 hover:bg-brand-green/10 hover:text-brand-green px-6 py-3 text-base"
            >
              <Link href="/#quem-sou-eu">Conhecer a Alice</Link>
            </Button>
          </div>
        </div>
      </section>

      <div
        className="animate-fade-up relative flex items-center justify-center px-6 pt-8 pb-16 lg:min-h-[calc(100vh-3.5rem)] lg:pt-0 lg:pb-0"
        style={{ animationDelay: '320ms' }}
        aria-hidden
      >
        {/* Manchas em tons de café para a ilustração não "flutuar" no fundo */}
        <div className="absolute left-1/2 top-1/2 aspect-square w-[85%] max-w-[480px] -translate-x-1/2 -translate-y-[46%] rounded-[42%_58%_55%_45%/48%_42%_58%_52%] bg-cafe-latte theme-dark:bg-muted/60" />
        <div className="absolute right-[12%] top-[22%] size-20 rounded-full bg-cafe-mocha/70 theme-dark:bg-muted lg:size-28" />
        <div className="absolute bottom-[24%] left-[14%] size-10 rounded-full border-2 border-brand-brown/20 lg:size-14" />
        <Image
          src="/menina-gato-livro-removebg.png"
          alt=""
          width={HERO_IMAGE_WIDTH}
          height={HERO_IMAGE_HEIGHT}
          sizes="(min-width: 1024px) 560px, (min-width: 640px) 420px, 80vw"
          className="relative w-[80vw] max-w-[320px] sm:max-w-[420px] object-contain drop-shadow-[0_18px_24px_rgba(62,39,35,0.18)] lg:w-full lg:max-w-[560px]"
          priority
        />
      </div>

      <Link
        href="/#destaque"
        className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-1 font-ui text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:text-brand-green lg:flex"
        aria-label="Ir para os artigos em destaque"
      >
        role
        <ChevronDown className="size-5 motion-safe:animate-bounce" aria-hidden />
      </Link>
    </LandingSection>
  );
}
