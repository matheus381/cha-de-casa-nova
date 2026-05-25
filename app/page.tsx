'use client';

import { useState } from 'react';
import { useCartHydration } from '@/hooks/use-cart-hydration';
import { useGiftsSync } from '@/hooks/use-gifts-sync';
import { DataLoadingGate } from '@/components/providers/data-loading-gate';
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
  const cartHydrated = useCartHydration();
  const { isLoading, error, retry } = useGiftsSync();

  const isReady = cartHydrated && !isLoading && !error;

  if (!cartHydrated || isLoading) {
    return (
      <DataLoadingGate
        isLoading
        error={null}
        loadingMessage="Carregando nosso lar..."
      >
        {null}
      </DataLoadingGate>
    );
  }

  if (error) {
    return (
      <DataLoadingGate isLoading={false} error={error} onRetry={retry}>
        {null}
      </DataLoadingGate>
    );
  }

  if (!isReady) return null;

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 selection:bg-violet-600/30 selection:text-violet-200 antialiased overflow-x-hidden">
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.15),rgba(255,255,255,0))] pointer-events-none z-0" />

      <Navbar />

      <HeroSection />

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

      <Footer />

      <CartDrawer onCheckout={() => setCheckoutOpen(true)} />

      <CheckoutModal
        isOpen={checkoutOpen}
        onClose={() => setCheckoutOpen(false)}
        onSuccess={() => setSuccessOpen(true)}
      />

      <SuccessModal
        isOpen={successOpen}
        onClose={() => setSuccessOpen(false)}
      />

      <ToastContainer />
    </div>
  );
}
