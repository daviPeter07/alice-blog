/**
 * Preferências de visualização do leitor (paleta, navbar, leitura).
 * Ficam no localStorage — funcionam sem login e são aplicadas antes do primeiro paint
 * pelo script inline em layout.tsx (ver PREFERENCES_INIT_SCRIPT).
 */

export const PREFERENCES_STORAGE_KEY = 'alice-prefs';
/** Mesma chave usada pelo ThemeProvider (next-themes) */
export const THEME_STORAGE_KEY = 'alice-theme';

export const THEME_MODES = ['light', 'dark', 'system', 'auto'] as const;

// Cada lista de opções é a fonte única dos valores aceitos, rótulos e valor CSS aplicado
export const FONT_SIZE_OPTIONS = [
  { value: 'sm', label: 'Pequena', css: '1rem' },
  { value: 'md', label: 'Média', css: '1.125rem' },
  { value: 'lg', label: 'Grande', css: '1.25rem' },
  { value: 'xl', label: 'Extra', css: '1.375rem' },
] as const;

export const READING_WIDTH_OPTIONS = [
  { value: 'narrow', label: 'Estreita', css: '42rem' },
  { value: 'normal', label: 'Normal', css: '56rem' },
  { value: 'wide', label: 'Larga', css: '72rem' },
] as const;

export const LINE_HEIGHT_OPTIONS = [
  { value: 'compact', label: 'Compacto', css: '1.55' },
  { value: 'normal', label: 'Normal', css: '1.75' },
  { value: 'relaxed', label: 'Arejado', css: '2' },
] as const;

export type ThemeMode = (typeof THEME_MODES)[number];
export type FontSizePref = (typeof FONT_SIZE_OPTIONS)[number]['value'];
export type ReadingWidthPref = (typeof READING_WIDTH_OPTIONS)[number]['value'];
export type LineHeightPref = (typeof LINE_HEIGHT_OPTIONS)[number]['value'];

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

/**
 * Horário em que o modo automático usa o tema escuro: 18h–6h.
 * Também é serializada no script inline, então precisa ser autocontida.
 */
export const isNightHour = (hour: number) => hour >= 18 || hour < 6;

const pick = <T extends string>(value: unknown, allowed: readonly T[], fallback: T): T =>
  typeof value === 'string' && (allowed as readonly string[]).includes(value)
    ? (value as T)
    : fallback;

const valuesOf = <T extends string>(options: readonly { value: T }[]) =>
  options.map((o) => o.value);

/** Valida o JSON vindo do localStorage — qualquer campo inválido volta ao padrão */
export const parsePreferences = (raw: unknown): Preferences => {
  const obj = raw && typeof raw === 'object' ? (raw as Record<string, unknown>) : {};
  const navKeys = NAV_ITEMS.map((i) => i.key as string);
  return {
    themeMode: pick(obj.themeMode, THEME_MODES, DEFAULT_PREFERENCES.themeMode),
    hiddenNavLinks: Array.isArray(obj.hiddenNavLinks)
      ? obj.hiddenNavLinks.filter((k): k is string => typeof k === 'string' && navKeys.includes(k))
      : [],
    fontSize: pick(obj.fontSize, valuesOf(FONT_SIZE_OPTIONS), DEFAULT_PREFERENCES.fontSize),
    readingWidth: pick(
      obj.readingWidth,
      valuesOf(READING_WIDTH_OPTIONS),
      DEFAULT_PREFERENCES.readingWidth
    ),
    lineHeight: pick(obj.lineHeight, valuesOf(LINE_HEIGHT_OPTIONS), DEFAULT_PREFERENCES.lineHeight),
  };
};

type ReadingKey = 'fontSize' | 'readingWidth' | 'lineHeight';
type ReadingScale = Record<ReadingKey, { values: Record<string, string>; fallback: string }>;

const toScale = (options: readonly { value: string; css: string }[], fallback: string) => ({
  values: Object.fromEntries(options.map((o) => [o.value, o.css])),
  fallback: options.find((o) => o.value === fallback)?.css ?? options[0].css,
});

/** Valores CSS por opção — vai como JSON para o script inline */
export const READING_SCALE: ReadingScale = {
  fontSize: toScale(FONT_SIZE_OPTIONS, DEFAULT_PREFERENCES.fontSize),
  readingWidth: toScale(READING_WIDTH_OPTIONS, DEFAULT_PREFERENCES.readingWidth),
  lineHeight: toScale(LINE_HEIGHT_OPTIONS, DEFAULT_PREFERENCES.lineHeight),
};

/**
 * Aplica as preferências de leitura e navbar no <html>.
 * Precisa ser autocontida (sem referências externas): é serializada com toString()
 * para o script inline que roda antes da hidratação — por isso tolera entrada não validada.
 */
export const applyPreferences = (
  prefs: { hiddenNavLinks: readonly unknown[] } & Record<ReadingKey, unknown>,
  scale: ReadingScale
) => {
  const vars = {
    fontSize: '--read-font-size',
    readingWidth: '--read-max-width',
    lineHeight: '--read-line-height',
  } as const;

  const root = document.documentElement;
  (Object.keys(vars) as ReadingKey[]).forEach((key) => {
    const value = scale[key].values[String(prefs[key])];
    root.style.setProperty(vars[key], typeof value === 'string' ? value : scale[key].fallback);
  });

  // Links ocultos via CSS: evita o "pisca" de links que somem só após a hidratação
  let style = document.getElementById('alice-nav-prefs');
  if (!style) {
    style = document.createElement('style');
    style.id = 'alice-nav-prefs';
    document.head.appendChild(style);
  }
  style.textContent = prefs.hiddenNavLinks
    .filter((key): key is string => typeof key === 'string')
    .map((key) => `[data-nav-key="${key.replace(/[^a-z-]/g, '')}"]{display:none!important}`)
    .join('');
};

/**
 * Roda logo após o script do next-themes: aplica leitura/navbar e, no modo automático,
 * sobrescreve o tema conforme o horário antes do primeiro paint. Cada etapa tem seu
 * próprio try para que um valor corrompido numa não impeça a outra.
 */
export const PREFERENCES_INIT_SCRIPT = `(function(){
var p={};try{p=JSON.parse(localStorage.getItem('${PREFERENCES_STORAGE_KEY}')||'{}')||{};}catch(e){}
try{(${applyPreferences.toString()})({hiddenNavLinks:Array.isArray(p.hiddenNavLinks)?p.hiddenNavLinks:[],fontSize:p.fontSize,readingWidth:p.readingWidth,lineHeight:p.lineHeight},${JSON.stringify(READING_SCALE)});}catch(e){}
try{if(p.themeMode==='auto'){var t=(${isNightHour.toString()})(new Date().getHours())?'dark':'light';
localStorage.setItem('${THEME_STORAGE_KEY}',t);var r=document.documentElement;r.setAttribute('data-theme',t);r.style.colorScheme=t;}}catch(e){}
})();`;
