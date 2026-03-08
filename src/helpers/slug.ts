/**
 * Gera um slug a partir do título: minúsculas, sem acentos, apenas [a-z0-9-].
 * Compatível com post.schema (slug regex ^[a-z0-9-]+$).
 * Ex.: "O Peso da Liberdade" → "o-peso-da-liberdade"
 */
export function slugFromTitle(title: string): string {
  if (!title.trim()) return '';
  return title
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}
