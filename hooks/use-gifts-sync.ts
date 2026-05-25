'use client';

import { useEffect } from 'react';
import { useGiftsStore } from '@/store/use-gifts-store';
import { useCartStore } from '@/store/use-cart-store';

export function useGiftsSync() {
  const isLoading = useGiftsStore((state) => state.isLoading);
  const error = useGiftsStore((state) => state.error);
  const giftsLength = useGiftsStore((state) => state.gifts.length);
  const fetchGifts = useGiftsStore((state) => state.fetchGifts);
  const subscribeRealtime = useGiftsStore((state) => state.subscribeRealtime);
  const syncCartWithCatalog = useCartStore((state) => state.syncCartWithCatalog);

  useEffect(() => {
    void fetchGifts();
    const unsubscribe = subscribeRealtime();
    return unsubscribe;
  }, [fetchGifts, subscribeRealtime]);

  useEffect(() => {
    if (!isLoading) {
      syncCartWithCatalog();
    }
  }, [isLoading, giftsLength, syncCartWithCatalog]);

  return {
    isLoading,
    error,
    retry: fetchGifts,
  };
}
