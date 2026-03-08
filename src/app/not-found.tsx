import Link from 'next/link';
import { Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

export default function NotFound() {
  return (
    <main className="min-h-[calc(100vh-3.5rem)] flex flex-col items-center justify-center px-6 py-16">
      <div className="max-w-xl w-full text-center space-y-8">
        {/* Espaço para foto */}
        <div className="flex justify-center">
          <Image
            src="/gato-chorando-removebg.png"
            alt="Ilustração 404"
            width={100}
            height={100}
            className="size-[200px] object-contain rounded-2xl"
          />
        </div>

        <div className="space-y-3">
          <p className="font-ui text-xs tracking-[0.2em] uppercase text-muted-foreground font-bold">
            Erro 404
          </p>
          <h1 className="font-heading text-3xl sm:text-4xl font-semibold text-foreground">
            Página não encontrada
          </h1>
          <p className="font-ui text-muted-foreground leading-relaxed max-w-md mx-auto">
            O endereço que você acessou não existe ou foi movido.
          </p>
        </div>

        <Button
          asChild
          size="lg"
          className="bg-brand-green hover:bg-brand-green/90 text-white font-semibold shadow-md hover:shadow-lg transition-shadow px-8 py-3"
        >
          <Link href="/" className="inline-flex items-center gap-2">
            <Home className="size-4" strokeWidth={2} />
            Voltar ao início
          </Link>
        </Button>
      </div>
    </main>
  );
}
