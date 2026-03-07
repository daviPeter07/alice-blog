/**
 * Gera um slug a partir do título: minúsculas, sem acentos, espaços → hífens.
 * Ex.: "O Peso da Liberdade" → "o-peso-da-liberdade"
 */
export function slugFromTitle(title: string): string {
  if (!title.trim()) return '';
  return title
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .replace(/[^\p{L}\p{N}\s-]/gu, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}
