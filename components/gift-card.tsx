'use client';

import { Gift } from '@/types';
import { useCartStore } from '@/store/use-cart-store';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ShoppingCart, Check } from 'lucide-react';
import { motion } from 'framer-motion';
import { useToastStore } from '@/store/use-toast-store';

interface GiftCardProps {
  gift: Gift;
}

export function GiftCard({ gift }: GiftCardProps) {
  const addToCart = useCartStore((state) => state.addToCart);
  const cart = useCartStore((state) => state.cart);
  const addToast = useToastStore((state) => state.addToast);
  
  const inCart = cart.some((item) => item.gift.id === gift.id);

  const formattedPrice = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(gift.price);

  const handleAddToCart = () => {
    if (!gift.available) return;
    addToCart(gift);
    addToast({
      title: 'Presente selecionado!',
      description: `"${gift.name}" foi adicionado ao seu carrinho.`,
      type: 'success',
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5 }}
      whileHover={gift.available ? { y: -6 } : undefined}
      className={cn(
        'group relative flex flex-col h-full rounded-2xl border overflow-hidden transition-all duration-300',
        gift.available
          ? 'bg-zinc-900/40 border-zinc-800/60 shadow-xl shadow-black/10 hover:shadow-violet-500/5 hover:border-zinc-700/50 backdrop-blur-sm'
          : 'bg-zinc-900/10 border-zinc-800/30 opacity-55 grayscale cursor-not-allowed'
      )}
    >
      {/* Product Image Area */}
      <div className="relative aspect-video w-full overflow-hidden bg-zinc-950">
        {/* Grayscale overlay & saturation adjust based on availability */}
        <img
          src={gift.image}
          alt={gift.name}
          className={cn(
            'object-cover w-full h-full transition-transform duration-500',
            gift.available ? 'group-hover:scale-105' : 'scale-100 filter saturate-[0.1]'
          )}
          loading="lazy"
        />
        
        {/* Availability Badge */}
        {!gift.available && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center backdrop-blur-[2px]">
            <span className="px-4 py-1.5 rounded-full bg-zinc-900/90 border border-zinc-700 text-xs font-bold uppercase tracking-wider text-zinc-300 shadow-md">
              Já escolhido
            </span>
          </div>
        )}

        {/* Category tag */}
        <div className="absolute top-3 left-3">
          <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-md bg-zinc-950/80 border border-zinc-800/80 text-zinc-400 backdrop-blur-sm">
            {gift.category}
          </span>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 flex flex-col p-5">
        <h3 className={cn(
          'text-base font-semibold tracking-tight line-clamp-1 mb-2',
          gift.available ? 'text-zinc-100 group-hover:text-white' : 'text-zinc-500'
        )}>
          {gift.name}
        </h3>
        
        {/* Price */}
        <p className={cn(
          'text-lg font-bold tracking-tight mb-5',
          gift.available ? 'text-zinc-200' : 'text-zinc-500'
        )}>
          {formattedPrice}
        </p>

        {/* Button */}
        <div className="mt-auto">
          {gift.available ? (
            <Button
              onClick={handleAddToCart}
              className={cn(
                'w-full h-10 rounded-xl font-medium transition-all duration-300',
                inCart
                  ? 'bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700/60'
                  : 'bg-zinc-100 hover:bg-white text-zinc-950 shadow-md'
              )}
            >
              {inCart ? (
                <>
                  <Check className="w-4 h-4 mr-2" />
                  No Carrinho
                </>
              ) : (
                <>
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Presentear
                </>
              )}
            </Button>
          ) : (
            <Button
              disabled
              className="w-full h-10 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-600 font-medium cursor-not-allowed"
            >
              Indisponível
            </Button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
