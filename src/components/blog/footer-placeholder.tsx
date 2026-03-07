/**
 * Placeholder do footer na landing até a US4 implementar Footer completo.
 * Exibe uma barra mínima para não deixar a página “cortada”.
 */
export function FooterPlaceholder() {
  return (
    <footer className="py-8 px-6 border-t border-border bg-background/30" aria-label="Rodapé">
      <div className="max-w-2xl mx-auto font-ui text-sm text-muted-foreground text-center">
        <p>© {new Date().getFullYear()} Alice. Reflexões sobre filosofia e crítica social.</p>
      </div>
    </footer>
  );
}
