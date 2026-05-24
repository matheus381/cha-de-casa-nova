'use client';

import { AdminDashboard } from '@/components/admin/admin-dashboard';
import { ToastContainer } from '@/components/ui/toast-container';
import { useCartHydration } from '@/hooks/use-cart-hydration';

export default function AdminPage() {
  const hydrated = useCartHydration();

  if (!hydrated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-950">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-violet-500/20 border-t-violet-500" />
          <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
            Carregando painel...
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <AdminDashboard />
      <ToastContainer />
    </>
  );
}
