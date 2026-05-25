import { create } from 'zustand';
import { fetchAllGifts, subscribeToGiftsChanges } from '@/lib/supabase/gifts';
import { getErrorMessage } from '@/lib/errors';
import type { Gift } from '@/types';

interface GiftsState {
  gifts: Gift[];
  isLoading: boolean;
  error: string | null;
  isRealtimeReady: boolean;
  fetchGifts: (options?: { silent?: boolean }) => Promise<void>;
  setGifts: (gifts: Gift[]) => void;
  upsertGiftLocal: (gift: Gift) => void;
  removeGiftLocal: (id: string) => void;
  markGiftsUnavailableLocal: (giftIds: string[]) => void;
  subscribeRealtime: () => () => void;
  clearError: () => void;
  isRefreshing: boolean;
}

let realtimeUnsubscribe: (() => void) | null = null;

export const useGiftsStore = create<GiftsState>((set, get) => ({
  gifts: [],
  isLoading: true,
  error: null,
  isRealtimeReady: false,

  fetchGifts: async (options) => {
  if (options?.silent) {
    set({ isRefreshing: true, error: null });
  } else {
    set({ isLoading: true, error: null });
  }

  try {
    const gifts = await fetchAllGifts();

    set({
      gifts,
      isLoading: false,
      isRefreshing: false,
      error: null,
    });
  } catch (error) {
    set({
      isLoading: false,
      isRefreshing: false,
      error: getErrorMessage(error, 'Não foi possível carregar os presentes.'),
    });
  }
},

  setGifts: (gifts) => set({ gifts }),

  upsertGiftLocal: (gift) =>
    set((state) => {
      const exists = state.gifts.some((g) => g.id === gift.id);
      if (exists) {
        return {
          gifts: state.gifts.map((g) => (g.id === gift.id ? gift : g)),
        };
      }
      return { gifts: [gift, ...state.gifts] };
    }),

  removeGiftLocal: (id) =>
    set((state) => ({
      gifts: state.gifts.filter((gift) => gift.id !== id),
    })),

  markGiftsUnavailableLocal: (giftIds) =>
    set((state) => ({
      gifts: state.gifts.map((gift) =>
        giftIds.includes(gift.id) ? { ...gift, available: false } : gift
      ),
    })),

  subscribeRealtime: () => {
    if (realtimeUnsubscribe) {
      return realtimeUnsubscribe;
    }

  realtimeUnsubscribe = subscribeToGiftsChanges(() => {
   void get().fetchGifts({ silent: true });
    });

    set({ isRealtimeReady: true });

    return () => {
      realtimeUnsubscribe?.();
      realtimeUnsubscribe = null;
      set({ isRealtimeReady: false });
    };
  },

  clearError: () => set({ error: null }),
}));
