'use client';

import { Home, Heart } from 'lucide-react';
import { useCartStore } from '@/store/use-cart-store';
import { Button } from '@/components/ui/button';
import { useToastStore } from '@/store/use-toast-store';

export function Footer() {
  const resetGifts = useCartStore((state) => state.resetGifts);
  const addToast = useToastStore((state) => state.addToast);

  const handleReset = () => {
    resetGifts();
    addToast({
      title: 'Lista reiniciada!',
      description: 'Todos os presentes voltaram a ficar disponíveis para testes.',
      type: 'info',
    });
  };

  return (
    <footer className="bg-zinc-950 border-t border-zinc-900/80 py-12 relative overflow-hidden">
      {/* Decorative Blur */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-96 h-24 bg-violet-600/5 blur-3xl pointer-events-none rounded-full" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col items-center gap-6">
        {/* Brand */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-violet-600 to-fuchsia-600 flex items-center justify-center">
            <Home className="w-4 h-4 text-white" />
          </div>
          <span className="font-semibold text-sm tracking-wide text-zinc-300">
            Nosso Lar
          </span>
        </div>

        {/* Message */}
        <p className="text-zinc-500 text-xs sm:text-sm text-center flex items-center gap-1.5 flex-wrap justify-center">
          Desenvolvido com
          <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 animate-pulse" />
          para celebrar o começo da nossa história.
        </p>

        {/* Reset list helper (useful for testing/demoing availability flow) */}
        <div className="mt-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleReset}
            className="text-[11px] font-semibold tracking-wider uppercase text-zinc-600 hover:text-zinc-400 hover:bg-zinc-900 border border-zinc-900 hover:border-zinc-800 transition-all rounded-lg h-8"
          >
            Resetar Estado da Lista
          </Button>
        </div>

        {/* Copyright */}
        <p className="text-zinc-600 text-[11px] tracking-wide mt-4">
          &copy; {new Date().getFullYear()} Nosso Lar. Todos os direitos reservados.
        </p>
      </div>
    </footer>
  );
}
