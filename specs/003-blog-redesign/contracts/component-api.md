# Component API Contracts — 003

**Branch**: `003-blog-redesign` | **Date**: 2026-03-07

Contratos dos novos componentes e alterações nos existentes para o redesign visual.

---

## Novos Componentes

### Navbar (`src/components/layout/navbar.tsx`)

Substitui ou refatora o Header existente. Estrutura: logo à esquerda; itens de navegação ao centro; à direita: toggle de tema; quando **não logado**: ícone person + "Seja bem-vindo" + **Entre** ou **Cadastre-se** (dois links); quando **logado**: ícone person + nome + dropdown (configurações, sair). Em viewport &lt;768px: menu hamburger.

```typescript
// src/components/layout/navbar.tsx
// "use client" — estado de sessão via HeaderWithSession ou props

export interface NavbarProps {
  navAnchors?: { href: string; label: string }[];
  showThemeToggle?: boolean;
  /** Não logado: exibir "Seja bem-vindo" + Entre | Cadastre-se */
  user?: { name: string; email: string } | null;
  /** Logo do projeto (texto ou componente) */
  logo?: React.ReactNode;
}

export function Navbar(props: NavbarProps): JSX.Element;
```

- Layout: logo esq, nav centro, tema + person/auth dir.
- **Entre** → `/auth/login`, **Cadastre-se** → `/auth/register`. "Entre" e "Cadastre-se" em bold, "ou" sem bold.
- Quando logado: dropdown com "Configurações" → `/settings`, "Sair" → abre ConfirmModal (variant `confirm`), ao confirmar chama logout.
- Hamburger: visível em `@media (max-width: 767px)`; ao abrir, exibir itens e ações em overlay ou drawer.
- Estrutura preparada para 004 (sidebar configurável): usar wrapper/container com classes que permitam futura troca de layout.

---

### ConfirmModal (`src/components/ui/confirm-modal.tsx`)

Modal reutilizável para confirmação (logout, exclusão) e aviso de login.

```typescript
// src/components/ui/confirm-modal.tsx
// "use client"

export type ConfirmModalVariant = 'confirm' | 'delete' | 'login';

export interface ConfirmModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  variant: ConfirmModalVariant;
  title: string;
  message?: string;
  /** Para variant=login: redireciona para /auth/login ao confirmar */
  onConfirm?: () => void;
  confirmLabel?: string;  // ex.: "Confirmar", "Excluir", "Entrar"
  cancelLabel?: string;   // ex.: "Cancelar"
  /** Para variant=login, onConfirm pode ser vazio (redirect automático) */
}

export function ConfirmModal(props: ConfirmModalProps): JSX.Element;
```

- `confirm`: botão primário; chama `onConfirm`.
- `delete`: botão destrutivo (vermelho); chama `onConfirm`.
- `login`: botão primário; ao confirmar, redireciona para `/auth/login` (e fecha modal).
- Usar Radix UI Dialog ou equivalente; acessível (foco, escape, aria).

---

### LandingSection (`src/components/blog/landing-section.tsx`)

Wrapper de seção com variantes de layout (texto à esquerda, texto à direita) para layouts variados por categoria.

```typescript
// src/components/blog/landing-section.tsx

export type LandingSectionLayout = 'text-left' | 'text-right' | 'center';

export interface LandingSectionProps {
  id?: string;
  layout?: LandingSectionLayout;
  children: React.ReactNode;
  className?: string;
}

export function LandingSection(props: LandingSectionProps): JSX.Element;
```

- `text-left`: conteúdo textual à esquerda, visual/CTA à direita.
- `text-right`: conteúdo textual à direita, visual à esquerda.
- `center`: layout centralizado (fallback).
- Usar grid/flex; responsivo (stack em mobile).
- **Extensível**: A landing terá mais seções (ex.: "Personalizar layout", "Como funciona o software"); novas seções devem usar `LandingSection` com variante apropriada e adicionar âncora em `navAnchors` da navbar.

---

### useIntersectionReveal (`src/hooks/use-intersection-reveal.ts`)

Hook para animação de aparição ao entrar no viewport. Respeita `prefers-reduced-motion`.

```typescript
// src/hooks/use-intersection-reveal.ts
// "use client"

export interface UseIntersectionRevealOptions {
  rootMargin?: string;   // default "0px 0px -50px 0px"
  threshold?: number;   // default 0.1
  /** Se true, não anima (prefers-reduced-motion) */
  disabled?: boolean;
}

export function useIntersectionReveal<T extends HTMLElement>(
  options?: UseIntersectionRevealOptions
): React.RefObject<T | null>;
```

- Retorna ref; quando elemento entra no viewport, adiciona classe `is-visible` (ou similar) para trigger de animação CSS.
- Se `prefers-reduced-motion: reduce` ou `disabled`, não adiciona animação (elemento visível desde o início).

---

## Alterações em Componentes Existentes

### LikeButton (003)

- Quando `isAuthenticated === false`: botão com opacidade baixa (ex.: `opacity-50`), aparenta desativado.
- Ao clicar quando não logado: abrir `ConfirmModal` variant `login` em vez de alerta.
- Manter `initialCount`, `initialLiked`, `isAuthenticated`; remover comportamento de alerta explícito.

### CommentSection (003)

- Quando `isAuthenticated === false`: área de comentário/form com opacidade baixa, aparenta desativada.
- Ao tentar enviar (ou focar em campo) quando não logado: abrir `ConfirmModal` variant `login` em vez de alerta.
- Manter props existentes; alterar gatilho de "alerta" para modal.

### Header / HeaderWithSession (003)

- Substituir por Navbar ou refatorar Header para usar estrutura da Navbar (logo esq, nav centro, person dir).
- Manter compatibilidade com `navAnchors`, `showThemeToggle`; adicionar suporte a "Entre | Cadastre-se" e dropdown quando logado.

---

## Páginas

### Settings (`src/app/settings/page.tsx`)

- Rota protegida (exige sessão; redirect para `/auth/login` se não logado).
- Conteúdo mínimo na 003: título "Configurações", estrutura base para 004 (paleta, layout navbar, layout leitura).
- Link no dropdown da navbar (item "Configurações").

---

## Breakpoints

| Breakpoint | Uso |
|------------|-----|
| 768px | Navbar: exibir hamburger abaixo de 768px |
| 320px–1920px | Layout responsivo conforme SC-005 |
