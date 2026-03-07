/**
 * Tipagens da landing page (hero, destaque, categorias, navegação).
 * Usado por Header, Footer e seções da home.
 */

export interface NavAnchor {
  href: string;
  label: string;
}

export interface CategoryItem {
  /** Slug ou identificador para link (ex.: tag normalizada) */
  slug: string;
  label: string;
}

/** Resultado de getRecentPosts — resumo de post para listagem/destaque */
export interface PostPreview {
  slug: string;
  title: string;
  excerpt: string | null;
  publishedAt: Date | null;
  tags: string[];
  readingTime: number | null;
  author: { name: string; image: string | null };
  _count: { likes: number; comments: number };
}
