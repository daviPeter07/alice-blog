import { cookies } from 'next/headers';
import { createHmac, timingSafeEqual } from 'node:crypto';

const COOKIE_NAME = 'alice_session';
const MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

function getSecret(): string {
  const secret = process.env.SESSION_SECRET;
  if (!secret || secret.length < 16) {
    throw new Error('SESSION_SECRET must be set and at least 16 characters');
  }
  return secret;
}

function sign(payload: string): string {
  const secret = getSecret();
  const hmac = createHmac('sha256', secret);
  hmac.update(payload);
  return hmac.digest('base64url');
}

function verify(payload: string, signature: string): boolean {
  const expected = sign(payload);
  if (expected.length !== signature.length) return false;
  try {
    return timingSafeEqual(Buffer.from(expected, 'utf8'), Buffer.from(signature, 'utf8'));
  } catch {
    return false;
  }
}

export interface SessionUser {
  userId: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'READER';
}

/**
 * Lê o cookie de sessão e retorna o usuário atual ou null.
 * Deve ser chamado apenas em Server Components / Server Actions.
 */
export async function getSession(): Promise<SessionUser | null> {
  const store = await cookies();
  const cookie = store.get(COOKIE_NAME);
  if (!cookie?.value) return null;

  const [payloadB64, signature] = cookie.value.split('.');
  if (!payloadB64 || !signature) return null;

  if (!verify(payloadB64, signature)) return null;

  let payload: { userId: string; name: string; email: string; role: 'ADMIN' | 'READER'; exp: number };
  try {
    payload = JSON.parse(Buffer.from(payloadB64, 'base64url').toString('utf8'));
  } catch {
    return null;
  }

  if (payload.exp < Date.now()) return null;
  if (!payload.userId || !payload.name || !payload.email || !payload.role) return null;

  return {
    userId: payload.userId,
    name: payload.name,
    email: payload.email,
    role: payload.role,
  };
}

/**
 * Cria a sessão (define o cookie).
 * Deve ser chamado apenas em Server Actions.
 */
export async function createSession(user: SessionUser): Promise<void> {
  const payload = {
    ...user,
    exp: Date.now() + MAX_AGE_MS,
  };
  const payloadB64 = Buffer.from(JSON.stringify(payload), 'utf8').toString('base64url');
  const signature = sign(payloadB64);
  const value = `${payloadB64}.${signature}`;

  const store = await cookies();
  store.set(COOKIE_NAME, value, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: Math.floor(MAX_AGE_MS / 1000),
    path: '/',
  });
}

/**
 * Destrói a sessão (remove o cookie).
 */
export async function destroySession(): Promise<void> {
  const store = await cookies();
  store.delete({ name: COOKIE_NAME, path: '/' });
}
