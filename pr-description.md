# PR: Fix hydration mismatch (React #418) em produção

**Branch**: `fix/hydration-mismatch`  
**Spec**: N/A (bug fix)  
**Relacionado**: Erro `#418 — Hydration failed because the initial UI does not match what was rendered on the server`

---

## Objetivo

Corrigir o erro de hidratação React #418 que aparecia apenas em produção, causado por componentes que acessavam APIs do navegador (`useTheme`, `matchMedia`) durante o SSR, gerando HTML divergente entre servidor e cliente.

---

## Alterações

### Sonner (Toaster)

- Adicionado **mounted guard** com `requestAnimationFrame` (padrão React 19).
- Toaster só renderiza após o mount do cliente, evitando que `useTheme()` retorne `undefined` no SSR e cause mismatch no portal do Sonner.

### Vercel Analytics

- Criado wrapper `ClientAnalytics` (`src/components/ui/analytics.tsx`) com mounted guard.
- `@vercel/analytics/next` agora só é montado após a hidratação, prevenindo injeção de DOM antes do React reconciliar.

### TypewriterText

- `skipAnimation` alterado de `useState` lazy initializer para resolução via `useEffect`.
- SSR e cliente iniciam com `false`; a checagem de `prefers-reduced-motion` acontece após o mount.

### Layout (fix menor)

- `LayoutFallback` usa `<Link>` em vez de `<a>` para navegação interna (resolve lint `@next/next/no-html-link-for-pages`).

---

## Arquivos principais

| Área       | Arquivos                                  |
| ---------- | ----------------------------------------- |
| Toaster    | `src/components/ui/sonner.tsx`            |
| Analytics  | `src/components/ui/analytics.tsx` (novo)  |
| Layout     | `src/app/layout.tsx`                      |
| Typewriter | `src/components/blog/typewriter-text.tsx` |

---

## Checklist

- [x] TypeScript sem erros (`pnpm typecheck`)
- [x] Lint sem warnings (`pnpm lint`)
- [x] Build de produção OK (`pnpm build`)
- [ ] Deploy em produção e verificação no console do navegador

---

## Como testar

1. **Deploy**: fazer deploy em produção e abrir o site.
2. **Console**: verificar se o erro `#418` ou `Hydration failed` sumiu do console do navegador.
3. **Toaster**: disparar um toast (ex: enviar comentário) e verificar que aparece normalmente após mount.
4. **Typewriter**: na landing page, com `prefers-reduced-motion: reduce` ativado, o texto completo deve aparecer sem animação após o mount.
5. **Analytics**: verificar que o script do Vercel Analytics ainda é injetado corretamente após a hidratação (verificar no DevTools → Network).
6. **Fallback**: ao carregar a página com cache limpo, o skeleton do `LayoutFallback` deve aparecer brevemente antes do navbar real.

---

## Notas

- Se o erro persistir após este fix, o próximo candidato é o `reactCompiler: true` em `next.config.ts` (experimental, pode alterar ordem de renderização).
- Todos os componentes que acessam APIs do navegador agora seguem o padrão: **renderizar placeholder estável no SSR → resolver estado real no `useEffect` após mount**.
