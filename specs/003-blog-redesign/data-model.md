# Data Model — 003 Redesign Visual

**Branch**: `003-blog-redesign` | **Date**: 2026-03-07

---

## Entidades

A feature 003 **não introduce novas entidades de dados**. O redesign atua apenas na camada de apresentação sobre entidades existentes:

- **User** — mantido; avatar por iniciais; sessão via cookie
- **Post** — mantido; exibição refinada
- **Comment** — mantido; exibição refinada
- **Like** — mantido; botão com opacidade quando !session

---

## Página de Configuração (003)

A página `/settings` (ou `/account/settings`) é criada na 003 com **conteúdo mínimo**:

- Rota protegida (exige sessão)
- Layout e estrutura base para a feature 004 (paleta configurável, layout navbar, layout leitura)
- Nenhuma preferência persistida no banco na 003; campos/estados serão adicionados na 004

**Sem alterações no Prisma schema.**

---

## Modal de Confirmação

O componente `ConfirmModal` não persiste dados. Variantes:

| Variante | Uso | Ação principal |
|----------|-----|----------------|
| `confirm` | Logout, ações genéricas | Botão "Confirmar" chama callback |
| `delete` | Excluir post, comentário | Botão "Excluir" (destrutivo) chama callback |
| `login` | Curtir/comentar sem sessão | Botão "Entrar" redireciona para `/auth/login` |

Nenhum dado novo no banco.

---

## Referência

Schema completo em `specs/001-blog-foundation/data-model.md` e `specs/002-blog-admin-theme/data-model.md`.
