import { LandingSection } from '@/components/blog/landing-section';

export function PersonalizarSection() {
  return (
    <LandingSection variant="categories-alt" layout="center" id="personalizar">
      <section aria-labelledby="personalizar-heading">
        <header>
          <p
            className="animate-fade-up font-ui text-xs tracking-[0.2em] uppercase text-muted-foreground mb-3 select-none"
            style={{ animationDelay: '0ms' }}
          >
            em breve
          </p>
          <h2
            id="personalizar-heading"
            className="animate-fade-up font-body text-3xl sm:text-4xl font-semibold text-foreground leading-tight"
            style={{ animationDelay: '60ms' }}
          >
            Personalizar layout
          </h2>
          <p
            className="animate-fade-up font-ui text-muted-foreground mt-2 leading-relaxed max-w-xl mx-auto"
            style={{ animationDelay: '120ms' }}
          >
            Ajuste paleta, navbar e layout de leitura ao seu gosto. Esta funcionalidade será
            disponibilizada em breve.
          </p>
        </header>
      </section>
    </LandingSection>
  );
}
