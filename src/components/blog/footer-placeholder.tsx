'use client';

/**
 * Placeholder do footer na landing até a US4 implementar Footer completo.
 * Ano obtido no cliente para evitar new Date() em Server Component.
 */
export function FooterPlaceholder() {
  const year = new Date().getFullYear();

  return (
    <footer className="py-8 px-6 border-t border-border bg-background/30" aria-label="Rodapé">
      <div className="max-w-2xl mx-auto font-ui text-sm text-muted-foreground text-center">
        <p>© {year} Alice.</p>
      </div>
    </footer>
  );
}
