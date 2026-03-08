import { Palette, PanelTop, BookOpen } from 'lucide-react';
import { LandingSection } from '@/components/blog/landing-section';

export function PersonalizarSection() {
  const headerEl = (
    <header className="mb-10 w-full">
      <p className="reveal-item reveal-from-left reveal-delay-0 font-ui text-xs tracking-[0.2em] uppercase text-muted-foreground mb-3 select-none">
        personalizar
      </p>
      <h2
        id="personalizar-heading"
        className="reveal-item reveal-from-right reveal-delay-1 font-heading text-2xl sm:text-3xl font-semibold text-foreground leading-tight"
      >
        Personalizar layout
      </h2>
      <p className="reveal-item reveal-from-left reveal-delay-2 font-ui text-muted-foreground mt-2 leading-relaxed text-sm max-w-xl">
        Ajuste paleta, navbar e layout de leitura ao seu gosto. Em breve você poderá salvar suas
        preferências.
      </p>
    </header>
  );

  const contentEl = (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      <div
        className="reveal-item reveal-from-right reveal-delay-3 group rounded-2xl border border-border bg-card p-6 min-h-[180px] flex flex-col
              hover:border-brand-green/30 transition-all duration-300"
      >
        <div className="mb-4 flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-brand-green/25 bg-brand-green/5 text-brand-green group-hover:border-brand-green/40 group-hover:bg-brand-green/10">
          <Palette className="size-5" strokeWidth={1.5} aria-hidden />
        </div>
        <h3 className="font-heading text-lg font-semibold text-foreground mb-2">Paleta</h3>
        <p className="font-ui text-sm text-muted-foreground leading-relaxed flex-1">
          Modo claro, escuro ou automático conforme o horário do sistema. Em breve.
        </p>
      </div>

      <div
        className="reveal-item reveal-from-left reveal-delay-4 group rounded-2xl border border-border bg-card p-6 min-h-[180px] flex flex-col
              hover:border-brand-green/30 transition-all duration-300"
      >
        <div className="mb-4 flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-brand-green/25 bg-brand-green/5 text-brand-green group-hover:border-brand-green/40 group-hover:bg-brand-green/10">
          <PanelTop className="size-5" strokeWidth={1.5} aria-hidden />
        </div>
        <h3 className="font-heading text-lg font-semibold text-foreground mb-2">Navbar</h3>
        <p className="font-ui text-sm text-muted-foreground leading-relaxed flex-1">
          Exiba ou oculte links da navegação. Em breve.
        </p>
      </div>

      <div
        className="reveal-item reveal-from-right reveal-delay-5 group rounded-2xl border border-border bg-card p-6 min-h-[180px] flex flex-col sm:col-span-2 lg:col-span-1
              hover:border-brand-green/30 transition-all duration-300"
      >
        <div className="mb-4 flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-brand-green/25 bg-brand-green/5 text-brand-green group-hover:border-brand-green/40 group-hover:bg-brand-green/10">
          <BookOpen className="size-5" strokeWidth={1.5} aria-hidden />
        </div>
        <h3 className="font-heading text-lg font-semibold text-foreground mb-2">Leitura</h3>
        <p className="font-ui text-sm text-muted-foreground leading-relaxed flex-1">
          Tamanho da fonte, largura da coluna de texto e espaçamento entre linhas. Em breve.
        </p>
      </div>
    </div>
  );

  return (
    <LandingSection variant="categories-alt" layout="wide" id="personalizar">
      <section aria-labelledby="personalizar-heading" className="w-full flex flex-col">
        {headerEl}
        {contentEl}
      </section>
    </LandingSection>
  );
}
