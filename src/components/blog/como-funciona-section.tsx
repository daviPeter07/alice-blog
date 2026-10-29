import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowRight,
  Compass,
  Tags,
  MessageCirclePlus,
  SlidersHorizontal,
  Share2,
} from 'lucide-react';
import { LandingSection } from '@/components/blog/landing-section';
import { SectionHeader } from '@/components/blog/section-header';

const STEPS = [
  {
    icon: Compass,
    title: 'Navegue pelos artigos',
    text: 'Veja os textos em destaque na página inicial ou acesse o blog para explorar todos os artigos.',
  },
  {
    icon: Tags,
    title: 'Explore os temas',
    text: 'Use as categorias para filtrar por assunto. Cada tag leva aos artigos daquele tema.',
  },
  {
    icon: MessageCirclePlus,
    title: 'Leia e participe',
    text: 'Comente nos posts e curta o que gostar. Cadastre-se para participar das conversas.',
  },
  {
    icon: SlidersHorizontal,
    title: 'Personalize',
    text: 'Ajuste paleta, navbar e layout de leitura. Suas preferências ficam salvas automaticamente.',
  },
  {
    icon: Share2,
    title: 'Compartilhe',
    text: 'Envie artigos por e-mail ou compartilhe em redes sociais diretamente da página do post.',
  },
] as const;

export function ComoFuncionaSection() {
  return (
    <LandingSection variant="categories-alt" layout="wide" id="como-funciona">
      <section aria-labelledby="como-funciona-heading" className="w-full">
        <SectionHeader
          id="como-funciona-heading"
          eyebrow="saiba mais"
          title="Como funciona"
          description="O Alice é um blog minimalista focado em textos e reflexões. Cadastre-se para comentar e curtir."
          align="center"
        />

        <div className="relative">
          <div
            className="absolute left-[10%] right-[10%] top-11 hidden border-t-2 border-dashed border-brand-brown/20 lg:block"
            aria-hidden
          />
          <ol className="relative grid gap-6 sm:grid-cols-2 lg:grid-cols-5 lg:gap-4">
            {STEPS.map(({ icon: Icon, title, text }, i) => (
              <li
                key={title}
                className={`reveal-item ${i % 2 === 0 ? 'reveal-from-left' : 'reveal-from-right'} reveal-delay-${Math.min(i + 3, 11)} group relative flex flex-col items-center rounded-2xl p-4 text-center`}
              >
                <div className="relative z-10 flex size-14 items-center justify-center rounded-full border-2 border-brand-green/30 bg-card text-brand-green shadow-sm transition-colors group-hover:border-brand-green group-hover:bg-brand-green group-hover:text-white theme-dark:text-foreground">
                  <Icon className="size-5" strokeWidth={1.75} aria-hidden />
                  <span className="absolute -right-1 -top-1 flex size-5 items-center justify-center rounded-full bg-brand-brown font-ui text-[10px] font-bold text-white">
                    {i + 1}
                  </span>
                </div>
                <h3 className="mb-2 mt-5 font-heading text-lg font-semibold text-foreground">
                  {title}
                </h3>
                <p className="max-w-[260px] font-ui text-sm leading-relaxed text-muted-foreground">
                  {text}
                </p>
              </li>
            ))}
          </ol>
        </div>

        {/* Chamada final */}
        <div className="reveal-item reveal-delay-8 relative mt-20 overflow-hidden rounded-3xl bg-brand-green px-8 py-12 text-white shadow-[0_24px_48px_-20px_rgba(27,48,34,0.6)] sm:px-12 md:pr-64">
          <div className="absolute -left-16 -top-16 size-56 rounded-full bg-white/5" aria-hidden />
          <div
            className="absolute -bottom-24 right-40 size-72 rounded-full bg-white/5"
            aria-hidden
          />
          <div className="relative max-w-xl">
            <h3 className="font-heading text-2xl font-semibold leading-tight sm:text-3xl">
              Pegue um café e fique à vontade.
            </h3>
            <p className="mt-3 font-ui leading-relaxed text-white/80">
              Leia os textos, deixe um comentário e faça parte das conversas por aqui.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                href="/blog"
                className="group inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 font-ui text-sm font-bold text-brand-green shadow-md transition-transform hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                Ler os artigos
                <ArrowRight
                  className="size-4 transition-transform group-hover:translate-x-0.5"
                  aria-hidden
                />
              </Link>
              <Link
                href="/auth/register"
                className="inline-flex items-center rounded-full border border-white/40 px-6 py-3 font-ui text-sm font-bold text-white transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                Criar conta
              </Link>
            </div>
          </div>
          <div
            className="absolute bottom-1/2 right-10 hidden size-48 translate-y-1/2 items-center justify-center rounded-full bg-cafe-cream shadow-inner md:flex theme-dark:bg-foreground/90"
            aria-hidden
          >
            <Image
              src="/gato-legal-removebg-preview.png"
              alt=""
              width={260}
              height={246}
              className="pointer-events-none w-56 max-w-none select-none"
            />
          </div>
        </div>
      </section>
    </LandingSection>
  );
}
