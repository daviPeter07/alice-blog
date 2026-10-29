/**
 * Preferências de visualização do leitor (paleta, navbar, leitura).
 * Ficam no localStorage — funcionam sem login e são aplicadas antes do primeiro paint
 * pelo script inline em layout.tsx (ver PREFERENCES_INIT_SCRIPT).
 */

export const PREFERENCES_STORAGE_KEY = 'alice-prefs';
/** Mesma chave usada pelo ThemeProvider (next-themes) */
export const THEME_STORAGE_KEY = 'alice-theme';

export type ThemeMode = 'light' | 'dark' | 'system' | 'auto';
export type FontSizePref = 'sm' | 'md' | 'lg' | 'xl';
export type ReadingWidthPref = 'narrow' | 'normal' | 'wide';
export type LineHeightPref = 'compact' | 'normal' | 'relaxed';

export interface Preferences {
  themeMode: ThemeMode;
  /** Chaves (NAV_ITEMS[].key) dos links ocultos na navbar */
  hiddenNavLinks: string[];
  fontSize: FontSizePref;
  readingWidth: ReadingWidthPref;
  lineHeight: LineHeightPref;
}

export const DEFAULT_PREFERENCES: Preferences = {
  themeMode: 'system',
  hiddenNavLinks: [],
  fontSize: 'md',
  readingWidth: 'normal',
  lineHeight: 'normal',
};

export const NAV_ITEMS = [
  { key: 'destaque', href: '/#destaque', label: 'Destaques' },
  { key: 'quem-sou-eu', href: '/#quem-sou-eu', label: 'Quem sou eu' },
  { key: 'categorias', href: '/#categorias', label: 'Categorias' },
  { key: 'personalizar', href: '/#personalizar', label: 'Personalizar' },
  { key: 'como-funciona', href: '/#como-funciona', label: 'Como funciona' },
  { key: 'artigos', href: '/blog', label: 'Artigos' },
] as const;

export const FONT_SIZE_OPTIONS: { value: FontSizePref; label: string }[] = [
  { value: 'sm', label: 'Pequena' },
  { value: 'md', label: 'Média' },
  { value: 'lg', label: 'Grande' },
  { value: 'xl', label: 'Extra' },
];

export const READING_WIDTH_OPTIONS: { value: ReadingWidthPref; label: string }[] = [
  { value: 'narrow', label: 'Estreita' },
  { value: 'normal', label: 'Normal' },
  { value: 'wide', label: 'Larga' },
];

export const LINE_HEIGHT_OPTIONS: { value: LineHeightPref; label: string }[] = [
  { value: 'compact', label: 'Compacto' },
  { value: 'normal', label: 'Normal' },
  { value: 'relaxed', label: 'Arejado' },
];

/** Horário em que o modo automático usa o tema escuro: 18h–6h */
export const isNightHour = (hour: number) => hour >= 18 || hour < 6;

const pick = <T extends string>(value: unknown, allowed: readonly T[], fallback: T): T =>
  typeof value === 'string' && (allowed as readonly string[]).includes(value)
    ? (value as T)
    : fallback;

/** Valida o JSON vindo do localStorage — qualquer campo inválido volta ao padrão */
export const parsePreferences = (raw: unknown): Preferences => {
  const obj = raw && typeof raw === 'object' ? (raw as Record<string, unknown>) : {};
  const navKeys = NAV_ITEMS.map((i) => i.key as string);
  return {
    themeMode: pick(obj.themeMode, ['light', 'dark', 'system', 'auto'], 'system'),
    hiddenNavLinks: Array.isArray(obj.hiddenNavLinks)
      ? obj.hiddenNavLinks.filter((k): k is string => typeof k === 'string' && navKeys.includes(k))
      : [],
    fontSize: pick(obj.fontSize, ['sm', 'md', 'lg', 'xl'], 'md'),
    readingWidth: pick(obj.readingWidth, ['narrow', 'normal', 'wide'], 'normal'),
    lineHeight: pick(obj.lineHeight, ['compact', 'normal', 'relaxed'], 'normal'),
  };
};

/**
 * Aplica as preferências de leitura e navbar no <html>.
 * Precisa ser autocontida (sem referências externas): é serializada com toString()
 * para o script inline que roda antes da hidratação.
 */
export function applyPreferences(prefs: {
  hiddenNavLinks: string[];
  fontSize: string;
  readingWidth: string;
  lineHeight: string;
}) {
  const fontSizes: Record<string, string> = {
    sm: '1rem',
    md: '1.125rem',
    lg: '1.25rem',
    xl: '1.375rem',
  };
  const widths: Record<string, string> = { narrow: '42rem', normal: '56rem', wide: '72rem' };
  const lineHeights: Record<string, string> = { compact: '1.55', normal: '1.75', relaxed: '2' };

  const root = document.documentElement;
  root.style.setProperty('--read-font-size', fontSizes[prefs.fontSize] ?? fontSizes.md);
  root.style.setProperty('--read-max-width', widths[prefs.readingWidth] ?? widths.normal);
  root.style.setProperty('--read-line-height', lineHeights[prefs.lineHeight] ?? lineHeights.normal);

  // Links ocultos via CSS: evita o "pisca" de links que somem só após a hidratação
  let style = document.getElementById('alice-nav-prefs');
  if (!style) {
    style = document.createElement('style');
    style.id = 'alice-nav-prefs';
    document.head.appendChild(style);
  }
  style.textContent = prefs.hiddenNavLinks
    .map((key) => `[data-nav-key="${key.replace(/[^a-z-]/g, '')}"]{display:none!important}`)
    .join('');
}

/**
 * Roda logo após o script do next-themes: aplica leitura/navbar e, no modo automático,
 * sobrescreve o tema conforme o horário antes do primeiro paint.
 */
export const PREFERENCES_INIT_SCRIPT = `(function(){try{
var p=JSON.parse(localStorage.getItem('${PREFERENCES_STORAGE_KEY}')||'{}')||{};
(${applyPreferences.toString()})({hiddenNavLinks:Array.isArray(p.hiddenNavLinks)?p.hiddenNavLinks:[],fontSize:p.fontSize,readingWidth:p.readingWidth,lineHeight:p.lineHeight});
if(p.themeMode==='auto'){var h=new Date().getHours();var t=(h>=18||h<6)?'dark':'light';
localStorage.setItem('${THEME_STORAGE_KEY}',t);var r=document.documentElement;r.setAttribute('data-theme',t);r.style.colorScheme=t;}
}catch(e){}})();`;
