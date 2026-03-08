'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Mail, Lock, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { login } from '@/actions/auth';
import { loginSchema, type LoginInput } from '@/lib/schemas/auth.schema';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const defaultValues: LoginInput = { email: '', password: '' };

export function LoginForm() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const {
    register: registerField,
    handleSubmit,
    setError,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    mode: 'onChange',
    defaultValues,
  });

  // Limpa os inputs ao entrar na tela (uma vez na montagem).
  useEffect(() => {
    const id = requestAnimationFrame(() => {
      reset(defaultValues);
      setServerError(null);
    });
    return () => cancelAnimationFrame(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- run only on mount to avoid resetting while user types
  }, []);

  const onSubmit = async (data: LoginInput) => {
    setServerError(null);
    const formData = new FormData();
    formData.set('email', data.email);
    formData.set('password', data.password);
    const result = await login(null, formData);

    if (result?.success) {
      router.push('/');
      router.refresh();
      return;
    }
    if (result && !result.success) {
      if (result.fieldErrors) {
        (Object.entries(result.fieldErrors) as [keyof LoginInput, string[]][]).forEach(
          ([field, messages]) =>
            setError(field, { type: 'server', message: messages?.[0] ?? 'Erro' })
        );
      } else {
        setServerError(result.error);
      }
    }
  };

  return (
    <div className="w-full max-w-md animate-fade-up">
      <div className="rounded-2xl border border-border bg-card p-8 shadow-lg">
        <div className="mb-8">
          <p className="font-ui text-xs tracking-[0.2em] uppercase text-muted-foreground mb-2">
            Bem-vindo de volta
          </p>
          <h1 className="font-body text-2xl font-semibold text-foreground">Entrar na sua conta</h1>
          <p className="font-ui text-sm text-muted-foreground mt-1">
            Use seu e-mail e senha para acessar.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {serverError && (
            <p className="font-ui text-sm text-destructive rounded-lg bg-destructive/10 px-4 py-2">
              {serverError}
            </p>
          )}

          <div>
            <label
              htmlFor="login-email"
              className="block font-ui text-sm font-medium text-foreground mb-1.5"
            >
              E-mail
            </label>
            <div className="relative">
              <Mail
                className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground"
                aria-hidden
              />
              <input
                id="login-email"
                type="email"
                autoComplete="email"
                placeholder="seu@email.com"
                className={cn(
                  'w-full rounded-xl border border-input bg-background py-3 pl-10 pr-4 font-ui text-sm',
                  'text-foreground placeholder:text-muted-foreground',
                  'focus:outline-none focus:ring-2 focus:ring-brand-green/40 focus:border-brand-green',
                  errors.email && 'border-destructive'
                )}
                {...registerField('email')}
              />
            </div>
            {errors.email && (
              <p className="mt-1 font-ui text-xs text-destructive">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="login-password"
              className="block font-ui text-sm font-medium text-foreground mb-1.5"
            >
              Senha
            </label>
            <div className="relative">
              <Lock
                className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground"
                aria-hidden
              />
              <input
                id="login-password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                placeholder="••••••••"
                className={cn(
                  'w-full rounded-xl border border-input bg-background py-3 pl-10 pr-11 font-ui text-sm',
                  'text-foreground placeholder:text-muted-foreground',
                  'focus:outline-none focus:ring-2 focus:ring-brand-green/40 focus:border-brand-green',
                  errors.password && 'border-destructive'
                )}
                {...registerField('password')}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-foreground focus:outline-none focus:ring-2 focus:ring-brand-green/40 focus:ring-offset-0 rounded-md"
                aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
              >
                {showPassword ? (
                  <EyeOff className="size-4" aria-hidden />
                ) : (
                  <Eye className="size-4" aria-hidden />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="mt-1 font-ui text-xs text-destructive">{errors.password.message}</p>
            )}
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-11 rounded-xl bg-brand-green hover:bg-brand-green/90 text-white font-ui font-medium"
          >
            {isSubmitting ? 'Entrando…' : 'Entrar'}
            <ArrowRight size={18} aria-hidden />
          </Button>
        </form>

        <p className="mt-6 text-center font-ui text-sm text-muted-foreground">
          Ainda não tem conta?{' '}
          <Link href="/auth/register" className="text-brand-green font-medium hover:underline">
            Criar conta
          </Link>
        </p>
      </div>
    </div>
  );
}
