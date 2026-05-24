'use client';

import { useState, useEffect } from 'react';
import { useCartHydration } from '@/hooks/use-cart-hydration';
import { useCartStore } from '@/store/use-cart-store';
import { ShoppingBag, Menu, X, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const hydrated = useCartHydration();

  const cart = useCartStore((state) => state.cart);
  const setCartOpen = useCartStore((state) => state.setCartOpen);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  const menuItems = [
    { label: 'Início', href: '#inicio' },
    { label: 'Cozinha', href: '#cozinha' },
    { label: 'Banheiro', href: '#banheiro' },
    { label: 'Sala de Estar', href: '#sala-de-estar' },
    { label: 'Quarto', href: '#quarto' },
    { label: 'Especiais', href: '#presentes-especiais' },
  ];

  if (!hydrated) {
    return null;
  }

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-40 transition-all duration-300 border-b',
        scrolled
          ? 'bg-zinc-950/75 border-zinc-800/40 backdrop-blur-md py-3 shadow-lg shadow-black/10'
          : 'bg-transparent border-transparent py-5'
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Logo / Brand */}
        <a href="#inicio" className="flex items-center gap-2 group">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-violet-500 to-fuchsia-500 flex items-center justify-center shadow-md shadow-violet-500/10 group-hover:scale-105 transition-all duration-300">
            <Home className="w-5 h-5 text-white" />
          </div>
          <span className="font-semibold text-base tracking-wide bg-gradient-to-r from-zinc-100 to-zinc-400 bg-clip-text text-transparent group-hover:from-white group-hover:to-zinc-300 transition-all duration-300">
            Nosso Lar
          </span>
        </a>

        {/* Desktop Menu */}
        <nav className="hidden md:flex items-center gap-8">
          {menuItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="text-sm font-medium text-zinc-400 hover:text-zinc-100 transition-colors duration-200"
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* Cart & Mobile Toggle */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCartOpen(true)}
            className="relative w-10 h-10 rounded-full border border-zinc-800 bg-zinc-900/40 backdrop-blur-sm hover:bg-zinc-800/60 hover:text-white transition-all duration-300"
          >
            <ShoppingBag className="w-4 h-4 text-zinc-300" />
            {totalItems > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-600 text-[10px] font-bold text-white flex items-center justify-center shadow-lg animate-in zoom-in-50 duration-200">
                {totalItems}
              </span>
            )}
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="md:hidden border border-zinc-800/60 bg-zinc-900/40"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 border-b border-zinc-800/60 bg-zinc-950/95 backdrop-blur-lg animate-in slide-in-from-top-4 duration-200">
          <nav className="flex flex-col p-4 gap-4">
            {menuItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-sm font-medium text-zinc-400 hover:text-zinc-100 px-3 py-2 rounded-lg hover:bg-zinc-900/50 transition-colors"
              >
                {item.label}
              </a>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
