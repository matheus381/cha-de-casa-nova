'use client';

import { useEffect, useState } from 'react';
import { useCartStore } from '@/store/use-cart-store';

/** Wait for Zustand persist to finish reading localStorage before rendering cart/gifts. */
export function useCartHydration() {
  const [hydrated, setHydrated] = useState(
    () => useCartStore.persist.hasHydrated()
  );

  useEffect(() => {
    const unsubscribe = useCartStore.persist.onFinishHydration(() => {
      setHydrated(true);
    });

    if (!useCartStore.persist.hasHydrated()) {
      void useCartStore.persist.rehydrate();
    } else {
      setHydrated(true);
    }

    return unsubscribe;
  }, []);

  return hydrated;
}
