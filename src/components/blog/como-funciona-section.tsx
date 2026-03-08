import {
  Compass,
  Tags,
  MessageCirclePlus,
  SlidersHorizontal,
  Share2,
} from 'lucide-react';
import { LandingSection } from '@/components/blog/landing-section';

export function ComoFuncionaSection() {
  const steps = [
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
      title: 'Personalize (em breve)',
      text: 'Ajuste paleta, navbar e layout de leitura. Suas preferências serão salvas automaticamente.',
    },
    {
      icon: Share2,
      title: 'Compartilhe (em breve)',
      text: 'Envie artigos por e-mail ou compartilhe em redes sociais diretamente da página do post.',
    },
  ];

  return (
    <LandingSection variant="footer" layout="wide" id="como-funciona">
      <section aria-labelledby="como-funciona-heading" className="w-full">
        <header className="mb-10 w-full">
          <p
            className="animate-fade-up font-ui text-xs tracking-[0.2em] uppercase text-muted-foreground mb-3 select-none"
            style={{ animationDelay: '0ms' }}
          >
            saiba mais
          </p>
          <h2
            id="como-funciona-heading"
            className="animate-fade-up font-body text-2xl sm:text-3xl font-semibold text-foreground leading-tight"
            style={{ animationDelay: '60ms' }}
          >
            Como funciona o software
          </h2>
          <p
            className="animate-fade-up font-ui text-muted-foreground mt-2 leading-relaxed text-sm max-w-xl"
            style={{ animationDelay: '120ms' }}
          >
            O Alice é um blog minimalista focado em textos e reflexões. Cadastre-se para comentar e curtir. Em breve, mais recursos de personalização.
          </p>
        </header>

        <div className="rounded-2xl border border-border bg-card p-8 sm:p-10 w-full">
          <div className="relative">
            <div
              className="absolute top-6 left-0 right-0 hidden h-px bg-linear-to-r from-transparent via-border to-transparent sm:block"
              aria-hidden
            />
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 sm:gap-6">
              {steps.map(({ icon: Icon, title, text }, i) => (
                <div
                  key={title}
                  className="relative flex flex-col items-center text-center sm:pt-6"
                  style={{ animationDelay: `${(i + 1) * 60}ms` }}
                >
                  <div
                    className="relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 border-border bg-background text-muted-foreground
                      transition-colors hover:border-brand-green/50 hover:text-brand-green"
                    aria-hidden
                  >
                    <Icon className="size-5" strokeWidth={1.5} />
                  </div>
                  <h3 className="font-body text-lg font-semibold text-foreground mt-4 mb-2">
                    {title}
                  </h3>
                  <p className="font-ui text-sm text-muted-foreground leading-relaxed max-w-[240px]">
                    {text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </LandingSection>
  );
}
