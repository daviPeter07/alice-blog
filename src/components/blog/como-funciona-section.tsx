import { LandingSection } from '@/components/blog/landing-section';

export function ComoFuncionaSection() {
  return (
    <LandingSection variant="footer" layout="center" id="como-funciona">
      <section aria-labelledby="como-funciona-heading">
        <header>
          <p
            className="animate-fade-up font-ui text-xs tracking-[0.2em] uppercase text-muted-foreground mb-3 select-none"
            style={{ animationDelay: '0ms' }}
          >
            saiba mais
          </p>
          <h2
            id="como-funciona-heading"
            className="animate-fade-up font-body text-3xl sm:text-4xl font-semibold text-foreground leading-tight"
            style={{ animationDelay: '60ms' }}
          >
            Como funciona o software
          </h2>
          <p
            className="animate-fade-up font-ui text-muted-foreground mt-2 leading-relaxed max-w-xl mx-auto"
            style={{ animationDelay: '120ms' }}
          >
            O Alice é um blog minimalista focado em textos e reflexões. Navegue pelos artigos,
            explore os temas e participe comentando. Em breve, mais recursos de personalização.
          </p>
        </header>
      </section>
    </LandingSection>
  );
}
