/**
 * Calcula tempo de leitura em minutos baseado na quantidade de caracteres.
 * Usa ~1000 caracteres por minuto (média para leitura em português).
 * Mínimo retornado: 1 min.
 */
export function computeReadingTime(content: string): number {
  if (!content || typeof content !== 'string') return 1;
  const chars = content.trim().length;
  const minutes = Math.ceil(chars / 1000);
  return Math.max(1, minutes);
}
