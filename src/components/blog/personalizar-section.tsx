import { Palette, PanelTop, BookOpen } from 'lucide-react';
import { LandingSection } from '@/components/blog/landing-section';
import { SectionHeader } from '@/components/blog/section-header';

const OPTIONS = [
  {
    icon: Palette,
    title: 'Paleta',
    text: 'Modo claro, escuro ou automático conforme o horário do sistema.',
  },
  {
    icon: PanelTop,
    title: 'Navbar',
    text: 'Exiba ou oculte links da navegação para deixar só o que importa.',
  },
  {
    icon: BookOpen,
    title: 'Leitura',
    text: 'Tamanho da fonte, largura da coluna de texto e espaçamento entre linhas.',
  },
] as const;

export function PersonalizarSection() {
  return (
    <LandingSection variant="categories" layout="wide" id="personalizar">
      <section aria-labelledby="personalizar-heading" className="flex w-full flex-col">
        <SectionHeader
          id="personalizar-heading"
          eyebrow="personalizar"
          title="Do seu jeito"
          description="Ajuste paleta, navbar e layout de leitura ao seu gosto. Em breve você poderá salvar suas preferências."
          align="center"
        />

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {OPTIONS.map(({ icon: Icon, title, text }, i) => (
            <div
              key={title}
              className={`reveal-item ${i % 2 === 0 ? 'reveal-from-right' : 'reveal-from-left'} reveal-delay-${i + 3} group relative flex min-h-[200px] flex-col overflow-hidden rounded-2xl border border-border bg-card p-7 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-brand-green/30 hover:shadow-[0_12px_32px_-12px_rgba(27,48,34,0.25)] ${i === 2 ? 'sm:col-span-2 lg:col-span-1' : ''}`}
            >
              <div
                className="absolute -right-10 -top-10 size-32 rounded-full bg-brand-green/5 transition-transform duration-500 group-hover:scale-125 theme-dark:bg-brand-green-light/10"
                aria-hidden
              />
              <div className="relative mb-5 flex items-center justify-between">
                <div className="flex size-12 items-center justify-center rounded-2xl bg-brand-green text-white shadow-md">
                  <Icon className="size-5" strokeWidth={1.75} aria-hidden />
                </div>
                <span className="rounded-full border border-brand-brown/20 bg-cafe-latte px-2.5 py-0.5 font-ui text-[11px] font-bold uppercase tracking-wider text-brand-brown theme-dark:bg-muted theme-dark:text-muted-foreground">
                  Em breve
                </span>
              </div>
              <h3 className="relative mb-2 font-heading text-xl font-semibold text-foreground">
                {title}
              </h3>
              <p className="relative flex-1 font-ui text-sm leading-relaxed text-muted-foreground">
                {text}
              </p>
            </div>
          ))}
        </div>
      </section>
    </LandingSection>
  );
}
