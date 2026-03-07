# Component API Contracts — 002

**Branch**: `002-blog-admin-theme` | **Date**: 2026-03-05

Contratos de props e comportamento dos componentes da feature 002 e ajustes nos da 001.

---

## Layout (`src/components/layout/`)

### Header

```typescript
// src/components/layout/header.tsx

export interface HeaderProps {
  // Opcional: links para âncoras da home (ex.: { href: "#destaque", label: "Destaques" })
  navAnchors?: { href: string; label: string }[];
  // Exibir botão de login quando não autenticado
  showLoginButton?: boolean;
  // Exibir toggle de tema
  showThemeToggle?: boolean;
  // Usuário logado (nome para exibir; avatar por iniciais no layout)
  user?: { name: string } | null;
}

export function Header(props: HeaderProps): JSX.Element;
```

- Ao clicar em item de `navAnchors` com `href` começando por `#`, usar scroll suave (`scrollIntoView({ behavior: 'smooth' })` ou link com `#id` e CSS `scroll-behavior: smooth` no html).

### Footer

```typescript
// src/components/layout/footer.tsx

export interface FooterProps {
  topics?: { href: string; label: string }[];
  contactEmail?: string;   // ex.: "alice@aliceblog.dev" para mailto
  contactLabel?: string;  // ex.: "Entrar em contato"
}

export function Footer(props: FooterProps): JSX.Element;
```

---

## UI

### ThemeToggle

```typescript
// src/components/ui/theme-toggle.tsx
// "use client" — lê/escreve tema (localStorage + data-theme no html) com transição

export interface ThemeToggleProps {
  className?: string;
  ariaLabel?: string; // ex.: "Alternar tema claro/escuro"
}

export function ThemeToggle(props: ThemeToggleProps): JSX.Element;
```

- Ao trocar tema: aplicar transição suave (CSS `transition` em `html` ou container principal).

### BackToTop

```typescript
// src/components/ui/back-to-top.tsx
// "use client" — visível quando window.scrollY > threshold

export interface BackToTopProps {
  threshold?: number;  // default 400
  className?: string;
}

export function BackToTop(props: BackToTopProps): JSX.Element;
```

- Ao clicar: `window.scrollTo({ top: 0, behavior: 'smooth' })`.

---

## Blog (ajustes 002)

### CommentSection

```typescript
// src/components/blog/comment-section.tsx

export interface CommentSectionProps {
  postId: string;
  initialComments: CommentWithReplies[];
  /** Se o usuário está logado; quando false, ao tentar enviar comentário exibir alerta de login */
  isAuthenticated?: boolean;
  /** Nome e email do usuário logado (preenchidos no servidor ao enviar); quando presentes, não exibir campos nome/email no form */
  currentUser?: { name: string; email: string } | null;
}
```

**Comportamento (002)**:
- Se `isAuthenticated === false` e o usuário tentar enviar comentário (ou focar no form): exibir alerta/mensagem "Faça login para comentar." com link para `/login`; não submeter.
- Toast de sucesso: configurado globalmente no layout com `position="bottom-right"`.
- Após envio com sucesso: manter scroll na área de comentários (não causar scroll para topo); opcionalmente `scrollIntoView` na seção de comentários.

### LikeButton

```typescript
// src/components/blog/like-button.tsx

export interface LikeButtonProps {
  postId: string;
  initialCount: number;
  initialLiked: boolean;
  /** Se false, ao clicar exibir alerta "Faça login para curtir." e link para login */
  isAuthenticated?: boolean;
}
```

---

## Páginas

### Layout root (`src/app/layout.tsx`)

- Incluir `<Toaster position="bottom-right" ... />` (Sonner) para que toasts (ex.: sucesso de comentário) apareçam no canto inferior direito.
- Incluir Provider de tema (se usar contexto) e aplicar `data-theme` ou classe no `<html>`.

### Landing (`src/app/page.tsx`)

- Seções: hero/CTA, artigos em destaque, categorias (tags), com IDs para âncoras (ex.: `id="destaque"`, `id="categorias"`).
- Header com nav para âncoras e ThemeToggle; Footer com tópicos e contato; BackToTop renderizado na página ou no layout.

### Post (`src/app/blog/[slug]/page.tsx`)

- Passar `isAuthenticated` e `currentUser` para `CommentSection` a partir da sessão no servidor.
- Passar `isAuthenticated` para `LikeButton`.
