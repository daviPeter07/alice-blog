'use server';

import { redirect } from 'next/navigation';
import bcrypt from 'bcryptjs';
import { loginSchema, registerSchema } from '@/lib/schemas/auth.schema';
import { createSession, destroySession } from '@/lib/auth';
import { getUserByEmail, createUser } from '@/data-access/users';
import type { ActionResult } from '@/lib/types';

const AUTH_ERROR = 'Credenciais inválidas.';

export async function login(
  _prevState: ActionResult<{ userId: string; name: string }> | null,
  formData: FormData
): Promise<ActionResult<{ userId: string; name: string }>> {
  const raw = {
    email: formData.get('email'),
    password: formData.get('password'),
  };

  const parsed = loginSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      success: false,
      error: 'Por favor, preencha e-mail e senha.',
      fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  const user = await getUserByEmail(parsed.data.email);
  if (!user?.passwordHash) {
    return { success: false, error: AUTH_ERROR };
  }

  const ok = await bcrypt.compare(parsed.data.password, user.passwordHash);
  if (!ok) {
    return { success: false, error: AUTH_ERROR };
  }

  await createSession({
    userId: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  });

  return {
    success: true,
    data: { userId: user.id, name: user.name },
  };
}

export async function register(
  _prevState: ActionResult<{ userId: string; name: string }> | null,
  formData: FormData
): Promise<ActionResult<{ userId: string; name: string }>> {
  const raw = {
    name: formData.get('name'),
    email: formData.get('email'),
    password: formData.get('password'),
  };

  const parsed = registerSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      success: false,
      error: 'Por favor, corrija os campos.',
      fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  const existing = await getUserByEmail(parsed.data.email);
  if (existing) {
    return { success: false, error: 'Este e-mail já está em uso.' };
  }

  const passwordHash = await bcrypt.hash(parsed.data.password, 10);
  const user = await createUser({
    name: parsed.data.name,
    email: parsed.data.email,
    passwordHash,
  });

  await createSession({
    userId: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  });

  return {
    success: true,
    data: { userId: user.id, name: user.name },
  };
}

export async function logout(): Promise<void> {
  await destroySession();
  redirect('/');
}
