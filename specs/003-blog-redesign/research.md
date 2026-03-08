# Research: Redesign Visual — 003

**Branch**: `003-blog-redesign` | **Date**: 2026-03-07

Pesquisa de referências e decisões técnicas para layout, animações e paleta (marrom escuro, verde escuro, branco, dark mode).

---

## Prioridade

A implementação da 003 deve ser guiada por esta pesquisa antes de codificar. Foco em: **layout** (seções esq/dir), **animações** (aparição de texto, transições) e **paleta** (marrom escuro, verde escuro, branco, dark mode).

---

## 1. Referências de Sites (≥10)

| # | Site / Fonte | Layout | Animações | Paleta | Notas |
|---|--------------|--------|-----------|--------|-------|
| 1 | [Rocketseat Blog](https://blog.rocketseat.com.br/) | Banner, Destaques, Categorias, Artigos recentes | Transições suaves | Roxo/azul, dark mode | Referência explícita da spec; estrutura hero + destaque + categorias |
| 2 | [Lapa Ninja — Green Landing Pages](https://www.lapa.ninja/color/green/) | Alternância esq/dir, split layout | Hover, scroll reveal | Verde, tons claros | Curadoria de landing pages verdes |
| 3 | [Colorhero — Modern Schemes 2025](https://colorhero.io/blog/modern-website-color-schemes-2025) | Warm muted bg + cool accents | — | Marrom escuro (#2D2A26), bege (#F5F0EB), verde/teal | Paleta alinhada com brand-brown/cloud-dancer |
| 4 | [Muffin Group — Green Palette](https://muffingroup.com/blog/green-color-palette/) | — | — | Forest green (#228B22), emerald (#50C878) | Tons de verde para acentos |
| 5 | [Blueprint Theme](https://blueprinttheme.com/) | Magazine/blog, grid | Dark mode automático | Dark mode, customizável | Dark mode nativo; nove demos |
| 6 | [Inertia WordPress Theme](https://inertiawp.com/) | Blog/magazine | — | Dark mode, accent colors | Dark mode built-in; 25+ demos |
| 7 | [Divi Soup — Alternating Layout](https://divisoup.com/how-to-create-a-fullwidth-alternating-blog-layout/) | Alternância odd/even (img esq/dir) | Hover, excerpt reveal | — | Padrão CSS odd/even para alternância |
| 8 | [Utility UI — Split Layout](https://www.utilityui.com/blocks/blog/featured-posts/split-layout) | Um post grande esq, dois pequenos dir | — | Tailwind | Layout assimétrico; referência Tailwind |
| 9 | [Hyvor Blog Design](https://hyvor.com/blog/blog-design) | Destaque, listagem, sidebar | — | — | Hierarquia visual de seções |
| 10 | [Blog Sitefy — Dark Mode Guide](https://blogsitefy.com/blog/blog-dark-mode-design-guide) | — | — | Dark mode, earth tones | Guia dark mode + tons terrosos |
| 11 | [Scroll-Based Text Reveal (DEV)](https://dev.to/pawar-shivam7/scroll-based-text-reveal-effect-using-pure-css-no-js-no-motion-library-34oa) | — | CSS scroll-driven, background-clip text | — | Técnica de animação de texto sem JS |
| 12 | [Design Drastic — Scroll Text Reveal](https://designdrastic.com/snippet/scroll-triggered-text-reveal/) | — | Intersection Observer, translateY, opacity | — | Técnica JS com melhor compatibilidade |

---

## 2. Decisões de Layout

### 2.1 Padrão por Categoria de Seção

**Decisão**: Cada categoria (hero, destaque, categorias) tem layout fixo, definido pela análise das referências.

**Padrão sugerido** (baseado em Rocketseat, Divi Soup, Utility UI):

| Seção | Layout | Rationale |
|-------|--------|-----------|
| Hero | Texto à esquerda, CTA/visual à direita | Padrão comum em CTAs; referência Rocketseat |
| Destaque | Texto à direita, cards/visual à esquerda | Alternância visual; referência split layout |
| Categorias | Central ou grid; pode ter texto esq, badges dir | Flexibilidade; referência Rocketseat "Explore categorias" |
| (Futuras) | Personalizar layout, Como funciona, etc. | Novas seções conforme necessário; usar `LandingSection` com variantes text-left/text-right/center |

**Alternativas consideradas**: Alternância estrita odd/even (mais rígido); layout 100% centralizado (rejeitado — spec exige variação).

**Seções futuras planejadas**: A landing terá mais seções, como "Personalizar o layout à vontade", "Como funciona o software" e outras. O componente `LandingSection` e a navbar (`navAnchors`) devem suportar extensão para novas seções e âncoras sem refatoração estrutural.

---

## 3. Decisões de Animações

### 3.1 Aparição de Texto

**Decisão**: Usar **Intersection Observer** + CSS transforms (`translateY`, `opacity`) para scroll-triggered reveal. Respeitar `prefers-reduced-motion` (desativar ou simplificar quando ativo).

**Rationale**: CSS scroll-driven (`animation-timeline: view()`) tem suporte limitado; Intersection Observer é amplamente suportado e oferece controle fino.

**Técnica** (referência Design Drastic):

```css
.reveal-word span {
  transform: translateY(110%);
  transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}
.is-visible .reveal-word span { transform: translateY(0); }
```

- Usar `@media (prefers-reduced-motion: reduce)` para reduzir ou remover animações.

### 3.2 Transições entre Seções

**Decisão**: Transições suaves (0.2–0.4s) para hover/focus; fade-in ou slide-up leve ao entrar no viewport.

**Alternativas**: CSS scroll-timeline (rejeitada — suporte incompleto); bibliotecas como Framer Motion (considerada — projeto já usa Tailwind, evitar dependência extra se possível; usar CSS + Intersection Observer).

---

## 4. Decisões de Paleta

### 4.1 Tokens Existentes (globals.css)

O projeto já possui:

```
--brand-brown:   #5D4037
--brand-brown-light: #8D6E63
--brand-green:   #1B3022
--brand-green-light: #2E5C3E
--cloud-dancer:  #F0EEE9
--landing-cream: #F5F3EF
--landing-sage:  #E8EFE9
--landing-warm:  #F4EFE8
```

**Decisão**: Manter tokens; referências (Colorhero, Muffin) confirmam marrom escuro + bege/creme + verde como paleta adequada. Dark mode: usar variáveis `[data-theme='dark']` já existentes.

### 4.2 Uso por Contexto

| Contexto | Light | Dark |
|----------|-------|------|
| Background | cloud-dancer, landing-cream, landing-sage | background (oklch escuro) |
| Texto | brand-brown, foreground | foreground |
| Acentos | brand-green, brand-green-light | brand-green-light |
| CTAs | brand-brown ou brand-green | brand-green-light |

---

## 5. Breakpoint Hamburger

**Decisão**: 768px (Tailwind `md`). Padrão comum; alinha com breakpoints de referências (Divi 980px para alternating; 768px é mais mobile-first).

**Alternativa**: 640px (`sm`) — rejeitada; 768px oferece mais espaço para navbar em tablets.

---

## 6. Modal de Confirmação

**Decisão**: Componente reutilizável com props: `title`, `message`, `confirmLabel`, `cancelLabel`, `onConfirm`, `onCancel`, `variant` (confirm | delete | login). Para login: botão "Entrar" redireciona para `/auth/login`.

**Rationale**: Um único componente evita duplicação; variantes permitem estilização (ex.: botão destrutivo em vermelho para delete).

---

## 7. Extensibilidade para 004

**Decisão**: Estruturar navbar com `data-*` ou classes que permitam, na 004, trocar entre barra horizontal e sidebar (esq/dir) via CSS/layout wrapper. Layout de leitura: usar wrapper com `className` configurável para futura divisão em colunas ou páginas.

**Rationale**: Evitar refatoração estrutural na 004; a 003 não implementa sidebar, apenas deixa a estrutura preparada.

---

## Summary

| Área | Decisão |
|------|---------|
| Layout | Por categoria (hero esq, destaque dir, categorias flexível); baseado em 12 referências |
| Animações | Intersection Observer + CSS transforms; respeitar `prefers-reduced-motion` |
| Paleta | Manter tokens existentes; marrom escuro, verde escuro, branco/creme, dark mode |
| Breakpoint hamburger | 768px |
| Modal | Componente reutilizável com variantes (confirm, delete, login) |
| Extensibilidade | Navbar e layout de leitura estruturados para sidebar/config na 004 |
