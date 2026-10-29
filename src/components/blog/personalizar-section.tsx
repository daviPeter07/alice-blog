import { ArrowRight, BookOpen, Palette, PanelTop, SlidersHorizontal } from 'lucide-react';
import { LandingSection } from '@/components/blog/landing-section';
import { SectionHeader } from '@/components/blog/section-header';
import { OpenPreferencesButton } from '@/components/preferences/open-preferences-button';

const OPTIONS = [
  {
    icon: Palette,
    title: 'Paleta',
    section: 'paleta',
    text: 'Modo claro, escuro ou automático conforme o horário do sistema.',
  },
  {
    icon: PanelTop,
    title: 'Navbar',
    section: 'navbar',
    text: 'Exiba ou oculte links da navegação para deixar só o que importa.',
  },
  {
    icon: BookOpen,
    title: 'Leitura',
    section: 'leitura',
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
          description="Ajuste paleta, navbar e layout de leitura ao seu gosto. Tudo fica salvo automaticamente neste navegador."
          align="center"
        />

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {OPTIONS.map(({ icon: Icon, title, text, section }, i) => (
            <div
              key={title}
              className={`reveal-item ${i % 2 === 0 ? 'reveal-from-right' : 'reveal-from-left'} reveal-delay-${i + 3} ${i === 2 ? 'sm:col-span-2 lg:col-span-1' : ''}`}
            >
              <OpenPreferencesButton
                section={section}
                aria-label={`Personalizar ${title.toLowerCase()}`}
                className="group relative flex h-full min-h-[200px] w-full flex-col overflow-hidden rounded-2xl border border-border bg-card p-7 text-left shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-brand-green/30 hover:shadow-[0_12px_32px_-12px_rgba(27,48,34,0.25)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <span
                  className="absolute -right-10 -top-10 size-32 rounded-full bg-brand-green/5 transition-transform duration-500 group-hover:scale-125 theme-dark:bg-brand-green-light/10"
                  aria-hidden
                />
                <span className="relative mb-5 flex size-12 items-center justify-center rounded-2xl bg-brand-green text-white shadow-md">
                  <Icon size={20} strokeWidth={1.75} aria-hidden />
                </span>
                <span className="relative mb-2 block font-heading text-xl font-semibold text-foreground">
                  {title}
                </span>
                <span className="relative block flex-1 font-ui text-sm leading-relaxed text-muted-foreground">
                  {text}
                </span>
                <span className="relative mt-5 inline-flex items-center gap-1.5 font-ui text-sm font-semibold text-brand-green theme-dark:text-brand-green-light">
                  Ajustar
                  <ArrowRight
                    size={16}
                    className="transition-transform group-hover:translate-x-1"
                    aria-hidden
                  />
                </span>
              </OpenPreferencesButton>
            </div>
          ))}
        </div>

        <div className="reveal-item reveal-delay-6 mt-10 flex justify-center">
          <OpenPreferencesButton className="inline-flex items-center gap-2 rounded-full bg-brand-green px-6 py-3 font-ui text-sm font-bold text-white shadow-md transition-transform hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
            <SlidersHorizontal size={16} aria-hidden />
            Abrir painel de personalização
          </OpenPreferencesButton>
        </div>
      </section>
    </LandingSection>
  );
}
