/**
 * Retorna as iniciais do nome (máx. 2 letras, das primeiras palavras).
 */
export function getInitials(name: string): string {
  return name
    .split(' ')
    .slice(0, 2)
    .map((n) => n[0])
    .join('')
    .toUpperCase();
}

/**
 * Gera um hue (0–360) estável a partir do nome, para cores de avatar.
 */
export function avatarHue(name: string): number {
  let h = 0;
  for (let i = 0; i < name.length; i++) {
    h = (h * 31 + name.charCodeAt(i)) % 360;
  }
  return h;
}
