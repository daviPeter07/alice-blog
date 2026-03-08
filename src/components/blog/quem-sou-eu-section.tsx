import Image from 'next/image';
import Link from 'next/link';
import { Instagram, Linkedin } from 'lucide-react';
import { LandingSection } from '@/components/blog/landing-section';

const ABOUT_IMAGE_SIZE = 380;

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
    <p className="font-ui text-muted-foreground leading-relaxed">
      <strong>Oi! Eu sou a Alice,</strong> uma mistura curiosa de criatividade, mil ideias por
      minuto e literatura. Sou apaixonada por tecnologia, design e tudo que envolve criar coisas
      novas, desde códigos até projetos malucos que começam só como uma ideia na cabeça.
    </p>
    <p className="font-ui text-muted-foreground leading-relaxed mt-4">
      <strong>Gosto de aprender sobre o mundo,</strong> questionar as coisas e imaginar
      possibilidades diferentes. Entre uma série, um livro ou uma conversa longa sobre qualquer
      assunto aleatório, estou sempre tentando entender melhor como as coisas funcionam (inclusive
      as pessoas).
    </p>
    <p className="font-ui text-muted-foreground leading-relaxed mt-4">
      <strong>Sou daquelas que sonha grande,</strong> mas também aprecia as pequenas coisas: uma
      música boa, uma risada inesperada ou aquela sensação de ter aprendido algo novo no dia.
    </p>
    <p className="font-ui text-muted-foreground leading-relaxed mt-4">
      <strong>No fundo, sou só alguém curiosa, criativa e determinada</strong> a construir coisas
      legais no caminho — seja na tecnologia, no design ou na vida.
    </p>
  </>
);

export function QuemSouEuSection({
  imageSrc = '/alice-marrom-bunita.jpeg',
  children = defaultText,
  linkedinUrl = 'https://www.linkedin.com/in/alice-sombra-764855243/',
  instagramUrl = 'https://www.instagram.com/alicequely/',
}: QuemSouEuSectionProps) {
  return (
    <LandingSection variant="categories-alt" layout="wide" id="quem-sou-eu">
      <section aria-labelledby="quem-sou-eu-heading" className="w-full flex flex-col">
        <header className="mb-12 w-full text-center">
          <p className="reveal-item reveal-from-left reveal-delay-0 font-ui text-xs tracking-[0.2em] uppercase text-muted-foreground mb-3 select-none">
            sobre
          </p>
          <h2
            id="quem-sou-eu-heading"
            className="reveal-item reveal-from-right reveal-delay-1 font-heading text-2xl sm:text-3xl font-semibold text-foreground leading-tight"
          >
            Quem sou eu
          </h2>
        </header>

        <div className="grid md:grid-cols-[minmax(0,520px)_minmax(0,320px)] gap-12 md:gap-20 lg:gap-28 items-center">
          <div className="reveal-item reveal-from-left reveal-delay-2 min-w-0 font-ui text-muted-foreground text-left md:max-w-[520px] pr-0">
            <div className="wrap-break-word">{children}</div>
          </div>
          <div
            className="reveal-item reveal-from-right reveal-delay-3 flex flex-col items-center gap-6"
            aria-hidden
          >
            {/* Foto + fundo e redes */}
            <div className="relative flex flex-col items-center gap-6 w-full max-w-[320px] md:max-w-none">
              <div className="relative flex flex-col items-center">
                <div
                  className="absolute -inset-4 rounded-xl bg-white theme-dark:bg-card shadow-lg theme-dark:shadow-[0_8px_30px_rgba(0,0,0,0.25)]"
                  aria-hidden
                />
                <div className="relative rounded-xl bg-white theme-dark:bg-card p-4 theme-dark:p-3 overflow-hidden">
                  <Image
                    src={imageSrc}
                    alt=""
                    width={ABOUT_IMAGE_SIZE}
                    height={ABOUT_IMAGE_SIZE}
                    className="object-contain rounded-lg w-full h-auto max-w-[280px] sm:max-w-[320px] md:max-w-none"
                    style={{ maxWidth: '100%', maxHeight: ABOUT_IMAGE_SIZE }}
                  />
                </div>
              </div>

              {/* Redes sociais — ícones proporcionais */}
              <div className="flex items-center justify-center gap-3 text-muted-foreground">
                <Link
                  href={linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-full border border-border bg-card hover:bg-brand-green/10 hover:text-brand-green hover:border-brand-green/30 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  aria-label="LinkedIn da Alice"
                >
                  <Linkedin className="size-5" />
                </Link>
                <Link
                  href={instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-full border border-border bg-card hover:bg-brand-green/10 hover:text-brand-green hover:border-brand-green/30 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  aria-label="Instagram da Alice"
                >
                  <Instagram className="size-5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </LandingSection>
  );
}
