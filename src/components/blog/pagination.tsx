import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  baseUrl: string;
  searchParams?: Record<string, string>;
}

function buildUrl(base: string, page: number, params?: Record<string, string>): string {
  const search = new URLSearchParams();
  search.set('page', String(page));
  if (params) {
    for (const [k, v] of Object.entries(params)) {
      if (k !== 'page' && v) search.set(k, v);
    }
  }
  return `${base}?${search.toString()}`;
}

export function Pagination({ currentPage, totalPages, baseUrl, searchParams }: PaginationProps) {
  const prevPage = currentPage - 1;
  const nextPage = currentPage + 1;
  const hasPrev = prevPage >= 1;
  const hasNext = nextPage <= totalPages;

  return (
    <nav
      className="flex items-center justify-center gap-2 mt-12 pt-8 border-t border-border"
      aria-label="Paginação"
    >
      {hasPrev ? (
        <Link
          href={buildUrl(baseUrl, prevPage, searchParams)}
          className="flex items-center gap-1 font-ui text-sm text-muted-foreground hover:text-foreground transition-colors px-3 py-2 rounded-lg hover:bg-accent"
          aria-label="Página anterior"
        >
          <ChevronLeft className="size-4" aria-hidden />
          Anterior
        </Link>
      ) : (
        <span
          className="flex items-center gap-1 font-ui text-sm text-muted-foreground/50 px-3 py-2 rounded-lg cursor-not-allowed"
          aria-disabled="true"
        >
          <ChevronLeft className="size-4" aria-hidden />
          Anterior
        </span>
      )}

      <span
        className="font-ui text-sm text-foreground px-4 py-2"
        aria-current="page"
        aria-label={`Página ${currentPage} de ${totalPages}`}
      >
        {currentPage} / {totalPages}
      </span>

      {hasNext ? (
        <Link
          href={buildUrl(baseUrl, nextPage, searchParams)}
          className="flex items-center gap-1 font-ui text-sm text-muted-foreground hover:text-foreground transition-colors px-3 py-2 rounded-lg hover:bg-accent"
          aria-label="Próxima página"
        >
          Próxima
          <ChevronRight className="size-4" aria-hidden />
        </Link>
      ) : (
        <span
          className="flex items-center gap-1 font-ui text-sm text-muted-foreground/50 px-3 py-2 rounded-lg cursor-not-allowed"
          aria-disabled="true"
        >
          Próxima
          <ChevronRight className="size-4" aria-hidden />
        </span>
      )}
    </nav>
  );
}
