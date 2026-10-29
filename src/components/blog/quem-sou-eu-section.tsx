import Image from 'next/image';
import Link from 'next/link';
import { Instagram, Linkedin } from 'lucide-react';
import { LandingSection } from '@/components/blog/landing-section';
import { SectionHeader } from '@/components/blog/section-header';

const ABOUT_IMAGE_WIDTH = 720;
const ABOUT_IMAGE_HEIGHT = 971;

export interface QuemSouEuSectionProps {
  /** Caminho da foto (ex.: /menina-gato-livro-removebg.png) */
  imageSrc?: string;
  /** Texto "quem sou eu" — parágrafos separados por \n ou um único texto */
  children?: React.ReactNode;
  /** URL do perfil LinkedIn */
  linkedinUrl?: string;
  /** URL do perfil Instagram */
  instagramUrl?: string;
}

const defaultText = (
  <>
    <p className="font-heading text-xl leading-relaxed text-foreground sm:text-2xl">
      <strong className="font-semibold text-brand-green theme-dark:text-brand-green-light">
        Oi! Eu sou a Alice,
      </strong>{' '}
      uma mistura curiosa de criatividade, mil ideias por minuto e literatura. Sou apaixonada por
      tecnologia, design e tudo que envolve criar coisas novas, desde códigos até projetos malucos
      que começam só como uma ideia na cabeça.
    </p>
    <p className="mt-5 font-ui leading-relaxed text-muted-foreground">
      <strong className="text-foreground">Gosto de aprender sobre o mundo,</strong> questionar as
      coisas e imaginar possibilidades diferentes. Entre uma série, um livro ou uma conversa longa
      sobre qualquer assunto aleatório, estou sempre tentando entender melhor como as coisas
      funcionam (inclusive as pessoas).
    </p>
    <p className="mt-5 font-ui leading-relaxed text-muted-foreground">
      <strong className="text-foreground">Sou daquelas que sonha grande,</strong> mas também aprecia
      as pequenas coisas: uma música boa, uma risada inesperada ou aquela sensação de ter aprendido
      algo novo no dia.
    </p>
    <p className="mt-5 font-ui leading-relaxed text-muted-foreground">
      <strong className="text-foreground">
        No fundo, sou só alguém curiosa, criativa e determinada
      </strong>{' '}
      a construir coisas legais no caminho — seja na tecnologia, no design ou na vida.
    </p>
  </>
);

const SOCIAL_LINK_CLASS =
  'inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 font-ui text-sm font-semibold text-foreground shadow-sm ' +
  'transition-colors duration-200 hover:border-brand-green/40 hover:bg-brand-green hover:text-white ' +
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring';

export function QuemSouEuSection({
  imageSrc = '/alice-marrom-bunita.jpeg',
  children = defaultText,
  linkedinUrl = 'https://www.linkedin.com/in/alice-sombra-764855243/',
  instagramUrl = 'https://www.instagram.com/alicequely/',
}: QuemSouEuSectionProps) {
  return (
    <LandingSection variant="categories" layout="wide" id="quem-sou-eu">
      <section aria-labelledby="quem-sou-eu-heading" className="flex w-full flex-col">
        <div className="grid items-center gap-14 md:grid-cols-[minmax(0,380px)_minmax(0,1fr)] lg:gap-24">
          {/* Foto em estilo polaroid; o gato é só decoração */}
          <div className="reveal-item reveal-from-right reveal-delay-1 relative mx-auto w-full max-w-[320px] md:max-w-none">
            <div
              className="absolute -inset-3 -rotate-3 rounded-3xl bg-brand-green/10 theme-dark:bg-brand-green-light/15"
              aria-hidden
            />
            <figure className="relative rotate-2 rounded-2xl bg-white p-3 pb-12 shadow-[0_18px_40px_-12px_rgba(62,39,35,0.35)] transition-transform duration-500 hover:rotate-0 theme-dark:bg-card">
              <Image
                src={imageSrc}
                alt="Foto da Alice"
                width={ABOUT_IMAGE_WIDTH}
                height={ABOUT_IMAGE_HEIGHT}
                sizes="(min-width: 768px) 380px, 320px"
                className="aspect-4/5 w-full rounded-xl object-cover"
              />
              <figcaption className="absolute inset-x-0 bottom-3 text-center font-heading text-base text-brand-brown theme-dark:text-muted-foreground">
                Alice ♥
              </figcaption>
            </figure>
            <Image
              src="/gato-coracao-removebg-preview.png"
              alt=""
              width={200}
              height={203}
              className="pointer-events-none absolute theme-dark:drop-shadow-[0_0_10px_rgba(255,255,255,0.55)] -bottom-14 -right-12 w-36 select-none sm:w-40"
              aria-hidden
            />
          </div>

          <div className="min-w-0">
            <SectionHeader
              id="quem-sou-eu-heading"
              eyebrow="sobre"
              title="Quem sou eu"
              className="mb-8"
            />
            <div className="reveal-item reveal-from-left reveal-delay-3 wrap-break-word max-w-[60ch] font-ui">
              {children}
            </div>
            <div className="reveal-item reveal-from-left reveal-delay-4 mt-8 flex flex-wrap items-center gap-3">
              <Link
                href={linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={SOCIAL_LINK_CLASS}
                aria-label="LinkedIn da Alice"
              >
                <Linkedin className="size-4" aria-hidden />
                LinkedIn
              </Link>
              <Link
                href={instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={SOCIAL_LINK_CLASS}
                aria-label="Instagram da Alice"
              >
                <Instagram className="size-4" aria-hidden />
                Instagram
              </Link>
            </div>
          </div>
        </div>
      </section>
    </LandingSection>
  );
}
