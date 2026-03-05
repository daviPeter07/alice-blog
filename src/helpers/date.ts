const DEFAULT_LOCALE = 'pt-BR';

/**
 * Formata uma data no locale pt-BR (dia, mês por extenso, ano).
 */
export function formatDate(date: Date, locale: string = DEFAULT_LOCALE): string {
  return new Intl.DateTimeFormat(locale, {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date);
}
