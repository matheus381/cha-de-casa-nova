'use client';

import { useEffect, useRef } from 'react';
import { useCartStore } from '@/store/use-cart-store';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CartDrawerProps {
  onCheckout: () => void;
}

export function CartDrawer({ onCheckout }: CartDrawerProps) {
  const cartOpen = useCartStore((state) => state.cartOpen);
  const setCartOpen = useCartStore((state) => state.setCartOpen);
  const cart = useCartStore((state) => state.cart);
  const removeFromCart = useCartStore((state) => state.removeFromCart);
  
  const drawerRef = useRef<HTMLDivElement>(null);

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setCartOpen(false);
      }
    };
    if (cartOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden'; // Prevent body scroll when open
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [cartOpen, setCartOpen]);

  // Calculate totals
  const totalValue = cart.reduce((acc, item) => acc + item.gift.price * item.quantity, 0);
  const formattedTotal = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(totalValue);

  return (
    <AnimatePresence>
      {cartOpen && (
        <>
          {/* Backdrop Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setCartOpen(false)}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
          />

          {/* Drawer Container */}
          <motion.div
            ref={drawerRef}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 bottom-0 z-50 w-full sm:max-w-md bg-zinc-900 border-l border-zinc-800 shadow-2xl flex flex-col h-full"
          >
            {/* Header */}
            <div className="p-6 border-b border-zinc-850 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-violet-400" />
                <h2 className="text-lg font-bold text-zinc-100">Seu Carrinho</h2>
                <span className="text-xs px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-400 font-semibold">
                  {cart.length}
                </span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setCartOpen(false)}
                className="w-8 h-8 rounded-full border border-zinc-800 bg-zinc-950/20 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            {/* Cart Items List */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              <AnimatePresence initial={false}>
                {cart.length > 0 ? (
                  cart.map((item) => {
                    const priceFormatted = new Intl.NumberFormat('pt-BR', {
                      style: 'currency',
                      currency: 'BRL',
                    }).format(item.gift.price);

                    return (
                      <motion.div
                        key={item.gift.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: 50 }}
                        className="flex gap-4 p-3 bg-zinc-950/30 border border-zinc-850/50 rounded-xl hover:border-zinc-800 transition-colors"
                      >
                        {/* Thumbnail */}
                        <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-zinc-900">
                          <img
                            src={item.gift.image}
                            alt={item.gift.name}
                            className="object-cover w-full h-full"
                          />
                        </div>

                        {/* Name and Price */}
                        <div className="flex-1 min-w-0 flex flex-col justify-center">
                          <h4 className="text-sm font-semibold text-zinc-100 truncate">
                            {item.gift.name}
                          </h4>
                          <p className="text-xs text-zinc-400 mt-1 uppercase font-bold tracking-wider">
                            {item.gift.category}
                          </p>
                          <p className="text-sm font-bold text-violet-400 mt-1">
                            {priceFormatted}
                          </p>
                        </div>

                        {/* Delete Button */}
                        <div className="flex items-center">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeFromCart(item.gift.id)}
                            className="w-8 h-8 text-zinc-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </motion.div>
                    );
                  })
                ) : (
                  /* Empty State */
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="h-full flex flex-col items-center justify-center text-center px-4"
                  >
                    <div className="w-16 h-16 rounded-full bg-zinc-850 flex items-center justify-center text-zinc-500 mb-4 border border-zinc-800">
                      <ShoppingBag className="w-6 h-6" />
                    </div>
                    <h3 className="text-base font-semibold text-zinc-200">
                      Carrinho Vazio
                    </h3>
                    <p className="text-sm text-zinc-500 mt-2 max-w-[240px]">
                      Selecione presentes da lista para adicionar ao seu carrinho.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Footer Summary */}
            {cart.length > 0 && (
              <div className="p-6 border-t border-zinc-850 bg-zinc-950/40 backdrop-blur-md">
                <div className="flex items-center justify-between mb-6">
                  <span className="text-sm font-medium text-zinc-400">Total</span>
                  <span className="text-xl font-bold text-white tracking-tight">
                    {formattedTotal}
                  </span>
                </div>
                <Button
                  onClick={onCheckout}
                  className="w-full h-12 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white font-medium shadow-lg shadow-violet-500/20 transition-transform active:scale-[0.98]"
                >
                  Finalizar Escolha
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
