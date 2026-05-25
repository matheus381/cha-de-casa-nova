import { create } from 'zustand';
import { persist, createJSONStorage, type StateStorage } from 'zustand/middleware';
import { Gift, CartItem } from '@/types';
import { useGiftsStore } from '@/store/use-gifts-store';

interface CartState {
  cart: CartItem[];
  cartOpen: boolean;
  setCartOpen: (open: boolean) => void;
  addToCart: (gift: Gift) => void;
  removeFromCart: (giftId: string) => void;
  clearCart: () => void;
  syncCartWithCatalog: () => void;
}

function syncCartItems(cart: CartItem[], gifts: Gift[]): CartItem[] {
  if (!cart.length) return [];

  const giftById = new Map(gifts.map((gift) => [gift.id, gift]));
  return cart
    .map((item) => {
      const gift = giftById.get(item.gift.id);
      if (!gift?.available) return null;
      return { ...item, gift };
    })
    .filter((item): item is CartItem => item !== null);
}

const localStorageAdapter = createJSONStorage(
  (): StateStorage =>
    typeof window !== 'undefined'
      ? localStorage
      : {
          getItem: () => null,
          setItem: () => undefined,
          removeItem: () => undefined,
        }
);

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      cart: [],
      cartOpen: false,
      setCartOpen: (open) => set({ cartOpen: open }),
      addToCart: (gift) =>
        set((state) => {
          const catalogGift =
            useGiftsStore.getState().gifts.find((g) => g.id === gift.id) ?? gift;

          if (!catalogGift.available) {
            return state;
          }

          const existingItemIndex = state.cart.findIndex(
            (item) => item.gift.id === catalogGift.id
          );
          if (existingItemIndex > -1) {
            return { cartOpen: true };
          }

          return {
            cart: [...state.cart, { gift: catalogGift, quantity: 1 }],
            cartOpen: true,
          };
        }),
      removeFromCart: (giftId) =>
        set((state) => ({
          cart: state.cart.filter((item) => item.gift.id !== giftId),
        })),
      clearCart: () => set({ cart: [] }),
      syncCartWithCatalog: () => {
        const gifts = useGiftsStore.getState().gifts;
        set((state) => ({ cart: syncCartItems(state.cart, gifts) }));
      },
    }),
    {
      name: 'housewarming-cart-storage',
      storage: localStorageAdapter,
      partialize: (state) => ({
        cart: state.cart,
      }),
      onRehydrateStorage: () => (state) => {
        if (!state) return;
        const gifts = useGiftsStore.getState().gifts;
        if (gifts.length > 0) {
          state.cart = syncCartItems(state.cart, gifts);
        }
      },
    }
  )
);
