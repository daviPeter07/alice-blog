'use client';

import { useEffect, useId, useRef, useState } from 'react';
import { Check, Clock, Monitor, Moon, RotateCcw, Sun } from 'lucide-react';
import { usePreferences } from '@/hooks/use-preferences';
import { useThemeMode } from '@/hooks/use-theme-mode';
import {
  FONT_SIZE_OPTIONS,
  LINE_HEIGHT_OPTIONS,
  NAV_ITEMS,
  READING_WIDTH_OPTIONS,
  type ThemeMode,
} from '@/lib/preferences';
import { cn } from '@/lib/utils';

export type PreferencesSection = 'paleta' | 'navbar' | 'leitura';

const THEME_OPTIONS: { value: ThemeMode; label: string; hint: string; icon: typeof Sun }[] = [
  { value: 'light', label: 'Claro', hint: 'Sempre claro', icon: Sun },
  { value: 'dark', label: 'Escuro', hint: 'Sempre escuro', icon: Moon },
  { value: 'system', label: 'Sistema', hint: 'Segue o aparelho', icon: Monitor },
  { value: 'auto', label: 'Automático', hint: 'Escuro à noite', icon: Clock },
];

interface SegmentedProps<T extends string> {
  label: string;
  value: T;
  options: readonly { value: T; label: string }[];
  onChange: (value: T) => void;
}

function Segmented<T extends string>({ label, value, options, onChange }: SegmentedProps<T>) {
  return (
    <div className="space-y-2">
      <p className="font-ui text-sm font-semibold text-foreground">{label}</p>
      <div role="radiogroup" aria-label={label} className="flex rounded-xl bg-muted p-1 gap-1">
        {options.map((opt) => {
          const selected = opt.value === value;
          return (
            <button
              key={opt.value}
              type="button"
              role="radio"
              aria-checked={selected}
              onClick={() => onChange(opt.value)}
              className={cn(
                'flex-1 rounded-lg px-2 py-1.5 font-ui text-xs sm:text-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                selected
                  ? 'bg-card text-foreground font-semibold shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              {opt.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function SectionTitle({
  id,
  title,
  description,
}: {
  id: string;
  title: string;
  description: string;
}) {
  return (
    <div className="mb-4">
      <h3 id={id} className="font-heading text-lg font-semibold text-foreground">
        {title}
      </h3>
      <p className="font-ui text-sm text-muted-foreground">{description}</p>
    </div>
  );
}

export interface PreferencesPanelProps {
  /** Seção para rolar ao abrir (ex.: vindo do card "Leitura" da landing) */
  initialSection?: PreferencesSection;
}

export function PreferencesPanel({ initialSection }: PreferencesPanelProps) {
  const { preferences, updatePreferences } = usePreferences();
  const { themeMode, setThemeMode, resetPreferences } = useThemeMode();
  // O painel pode existir duas vezes na página (/settings + diálogo): ids e rolagem por instância
  const idPrefix = useId();
  const sectionId = (section: PreferencesSection) => `${idPrefix}-${section}`;
  const containerRef = useRef<HTMLDivElement>(null);
  // O servidor não conhece o localStorage: só mostra a seleção real após montar
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => {
      setMounted(true);
      if (initialSection) {
        containerRef.current
          ?.querySelector(`[data-pref-section="${initialSection}"]`)
          ?.scrollIntoView({ block: 'start', behavior: 'smooth' });
      }
    });
    return () => cancelAnimationFrame(id);
  }, [initialSection]);

  const toggleNavLink = (key: string) => {
    const hidden = preferences.hiddenNavLinks;
    updatePreferences({
      hiddenNavLinks: hidden.includes(key) ? hidden.filter((k) => k !== key) : [...hidden, key],
    });
  };

  return (
    <div ref={containerRef} className={cn('space-y-10', !mounted && 'opacity-0')}>
      <section aria-labelledby={sectionId('paleta')} data-pref-section="paleta">
        <SectionTitle
          id={sectionId('paleta')}
          title="Paleta"
          description="Escolha como o site deve aparecer para você."
        />
        <div role="radiogroup" aria-label="Tema" className="grid grid-cols-2 gap-2">
          {THEME_OPTIONS.map(({ value, label, hint, icon: Icon }) => {
            const selected = themeMode === value;
            return (
              <button
                key={value}
                type="button"
                role="radio"
                aria-checked={selected}
                onClick={() => setThemeMode(value)}
                className={cn(
                  'flex items-center gap-3 rounded-xl border p-3 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                  selected
                    ? 'border-brand-green bg-brand-green/10'
                    : 'border-border bg-card hover:border-brand-green/40'
                )}
              >
                <span
                  className={cn(
                    'flex size-9 shrink-0 items-center justify-center rounded-lg',
                    selected ? 'bg-brand-green text-white' : 'bg-muted text-muted-foreground'
                  )}
                >
                  <Icon size={16} aria-hidden />
                </span>
                <span className="min-w-0">
                  <span className="block font-ui text-sm font-semibold text-foreground">
                    {label}
                  </span>
                  <span className="block truncate font-ui text-xs text-muted-foreground">
                    {hint}
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      </section>

      <section aria-labelledby={sectionId('navbar')} data-pref-section="navbar">
        <SectionTitle
          id={sectionId('navbar')}
          title="Navbar"
          description="Mostre só os links que você usa."
        />
        <ul className="grid gap-2 sm:grid-cols-2">
          {NAV_ITEMS.map((item) => {
            const visible = !preferences.hiddenNavLinks.includes(item.key);
            return (
              <li key={item.key}>
                <button
                  type="button"
                  role="switch"
                  aria-checked={visible}
                  onClick={() => toggleNavLink(item.key)}
                  className="flex w-full items-center justify-between gap-3 rounded-xl border border-border bg-card px-4 py-2.5 font-ui text-sm text-foreground transition-colors hover:border-brand-green/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <span className={cn(!visible && 'text-muted-foreground line-through')}>
                    {item.label}
                  </span>
                  <span
                    className={cn(
                      'relative h-5 w-9 shrink-0 rounded-full transition-colors',
                      visible ? 'bg-brand-green' : 'bg-muted-foreground/30'
                    )}
                    aria-hidden
                  >
                    <span
                      className={cn(
                        'absolute left-0.5 top-0.5 size-4 rounded-full bg-white shadow transition-transform',
                        visible ? 'translate-x-4' : 'translate-x-0'
                      )}
                    />
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </section>

      <section aria-labelledby={sectionId('leitura')} data-pref-section="leitura">
        <SectionTitle
          id={sectionId('leitura')}
          title="Leitura"
          description="Ajuste o texto dos artigos para ler com conforto."
        />
        <div className="space-y-5">
          <Segmented
            label="Tamanho da fonte"
            value={preferences.fontSize}
            options={FONT_SIZE_OPTIONS}
            onChange={(fontSize) => updatePreferences({ fontSize })}
          />
          <Segmented
            label="Largura da coluna"
            value={preferences.readingWidth}
            options={READING_WIDTH_OPTIONS}
            onChange={(readingWidth) => updatePreferences({ readingWidth })}
          />
          <Segmented
            label="Espaçamento entre linhas"
            value={preferences.lineHeight}
            options={LINE_HEIGHT_OPTIONS}
            onChange={(lineHeight) => updatePreferences({ lineHeight })}
          />

          <div className="rounded-xl border border-border bg-card p-4">
            <p className="mb-2 font-ui text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">
              Prévia
            </p>
            <p className="prose-alice">
              Ler é conversar com quem não está presente. Cada página abre uma janela para outro
              tempo, outro lugar, outra forma de enxergar o mundo.
            </p>
          </div>
        </div>
      </section>

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border pt-6">
        <p className="flex items-center gap-1.5 font-ui text-xs text-muted-foreground">
          <Check size={14} className="text-brand-green" aria-hidden />
          Salvo automaticamente neste navegador
        </p>
        <button
          type="button"
          onClick={resetPreferences}
          className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 font-ui text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
        >
          <RotateCcw size={14} aria-hidden />
          Restaurar padrão
        </button>
      </div>
    </div>
  );
}
