'use client';

import { useState } from 'react';
import { useCartHydration } from '@/hooks/use-cart-hydration';
import { Navbar } from '@/components/navbar';
import { HeroSection } from '@/components/hero-section';
import { CategorySection } from '@/components/category-section';
import { CartDrawer } from '@/components/cart-drawer';
import { CheckoutModal } from '@/components/checkout-modal';
import { SuccessModal } from '@/components/success-modal';
import { Footer } from '@/components/footer';
import { ToastContainer } from '@/components/ui/toast-container';

export default function Home() {
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const hydrated = useCartHydration();

  if (!hydrated) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center select-none">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-violet-500/20 border-t-violet-500 rounded-full animate-spin" />
          <p className="text-zinc-500 text-xs font-semibold uppercase tracking-wider animate-pulse">
            Carregando nosso lar...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 selection:bg-violet-600/30 selection:text-violet-200 antialiased overflow-x-hidden">
      {/* Floating Particles or Ambient Overlay */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.15),rgba(255,255,255,0))] pointer-events-none z-0" />

      {/* Header / Navbar */}
      <Navbar />
      
      {/* Hero */}
      <HeroSection />
      
      {/* Categorized Sections */}
      <main className="relative z-10 pb-20 space-y-4">
        <CategorySection
          id="cozinha"
          title="Cozinha"
          category="Cozinha"
          description="Utensílios práticos e eletrodomésticos para inspirar nossas receitas no dia a dia."
        />
        
        <CategorySection
          id="banheiro"
          title="Banheiro"
          category="Banheiro"
          description="Itens de enxoval e organização para trazer conforto e frescor a nossa rotina."
        />
        
        <CategorySection
          id="sala-de-estar"
          title="Sala de Estar"
          category="Sala de Estar"
          description="Detalhes de iluminação e decoração para deixar nosso cantinho aconchegante."
        />
        
        <CategorySection
          id="quarto"
          title="Quarto"
          category="Quarto"
          description="Roupa de cama de fios egípcios e almofadas confortáveis para o nosso descanso."
        />
        
        <CategorySection
          id="presentes-especiais"
          title="Presentes Especiais"
          category="Presentes Especiais"
          description="Tecnologias inteligentes e itens diferenciados para marcar nossa nova jornada."
        />
      </main>

      {/* Footer */}
      <Footer />

      {/* Cart Drawer */}
      <CartDrawer onCheckout={() => setCheckoutOpen(true)} />

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={checkoutOpen}
        onClose={() => setCheckoutOpen(false)}
        onSuccess={() => setSuccessOpen(true)}
      />

      {/* Success Modal */}
      <SuccessModal
        isOpen={successOpen}
        onClose={() => setSuccessOpen(false)}
      />

      {/* Toast Notifications */}
      <ToastContainer />
    </div>
  );
}
