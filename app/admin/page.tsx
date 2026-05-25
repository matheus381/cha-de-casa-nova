'use client';

import { AdminDashboard } from '@/components/admin/admin-dashboard';
import { ToastContainer } from '@/components/ui/toast-container';
import { DataLoadingGate } from '@/components/providers/data-loading-gate';
import { useCartHydration } from '@/hooks/use-cart-hydration';
import { useGiftsSync } from '@/hooks/use-gifts-sync';
import { useGiftsStore } from '@/store/use-gifts-store';
import { AdminLogin } from './login';

export default function AdminPage() {
  const cartHydrated = useCartHydration();
  const { isLoading, error, retry } = useGiftsSync();

  const gifts = useGiftsStore((state) => state.gifts);

  if (!cartHydrated || (isLoading && gifts.length === 0)) {
  return (
    <DataLoadingGate
      isLoading
      error={null}
      loadingMessage="Carregando painel..."
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

  return (
  <AdminLogin>
    <>
      <AdminDashboard />
      <ToastContainer />
    </>
  </AdminLogin>
  );
}
