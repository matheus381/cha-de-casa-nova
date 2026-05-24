import { create } from 'zustand';
import { persist, createJSONStorage, type StateStorage } from 'zustand/middleware';
import { Gift, CartItem } from '@/types';
import { initialGifts } from '@/data/gifts';
import {
  createGiftId,
  mergeGiftsWithCatalog,
  normalizeGift,
  type GiftSeed,
} from '@/lib/gifts';

interface CartState {
  gifts: Gift[];
  cart: CartItem[];
  cartOpen: boolean;
  setCartOpen: (open: boolean) => void;
  addToCart: (gift: Gift) => void;
  removeFromCart: (giftId: string) => void;
  clearCart: () => void;
  confirmPurchase: (giftIds: string[]) => void;
  addGift: (input: Omit<GiftSeed, 'id' | 'available'> & { available?: boolean }) => Gift;
  updateGift: (id: string, updates: Partial<Gift>) => void;
  deleteGift: (id: string) => void;
  toggleGiftAvailability: (id: string) => void;
  resetGifts: () => void;
}

type PersistedCartState = Pick<CartState, 'gifts' | 'cart'>;

function syncCartWithGifts(cart: CartItem[] | undefined, gifts: Gift[]): CartItem[] {
  if (!cart?.length) return [];

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
    (set) => ({
      gifts: initialGifts,
      cart: [],
      cartOpen: false,
      setCartOpen: (open) => set({ cartOpen: open }),
      addToCart: (gift) =>
        set((state) => {
          const currentGift = state.gifts.find((g) => g.id === gift.id);
          if (!currentGift?.available) {
            return state;
          }

          const existingItemIndex = state.cart.findIndex(
            (item) => item.gift.id === gift.id
          );
          if (existingItemIndex > -1) {
            return { cartOpen: true };
          }
          return {
            cart: [...state.cart, { gift: currentGift, quantity: 1 }],
            cartOpen: true,
          };
        }),
      removeFromCart: (giftId) =>
        set((state) => ({
          cart: state.cart.filter((item) => item.gift.id !== giftId),
        })),
      clearCart: () => set({ cart: [] }),
      confirmPurchase: (giftIds) =>
        set((state) => {
          const updatedGifts = state.gifts.map((gift) =>
            giftIds.includes(gift.id) ? { ...gift, available: false } : gift
          );
          return {
            gifts: updatedGifts,
            cart: [],
          };
        }),
      addGift: (input) => {
        const gift = normalizeGift({
          ...input,
          id: createGiftId(input.category, input.name),
          available: input.available ?? true,
        });

        set((state) => ({ gifts: [gift, ...state.gifts] }));
        return gift;
      },
      updateGift: (id, updates) =>
        set((state) => {
          const gifts = state.gifts.map((gift) =>
            gift.id === id ? normalizeGift({ ...gift, ...updates }) : gift
          );
          const cart = state.cart.map((item) =>
            item.gift.id === id
              ? { ...item, gift: gifts.find((g) => g.id === id)! }
              : item
          );
          return { gifts, cart };
        }),
      deleteGift: (id) =>
        set((state) => ({
          gifts: state.gifts.filter((gift) => gift.id !== id),
          cart: state.cart.filter((item) => item.gift.id !== id),
        })),
      toggleGiftAvailability: (id) =>
        set((state) => ({
          gifts: state.gifts.map((gift) =>
            gift.id === id ? { ...gift, available: !gift.available } : gift
          ),
        })),
      resetGifts: () => set({ gifts: initialGifts, cart: [] }),
    }),
    {
      name: 'housewarming-gift-list-storage',
      storage: localStorageAdapter,
      partialize: (state): PersistedCartState => ({
        gifts: state.gifts,
        cart: state.cart,
      }),
      merge: (persisted, currentState) => {
        const saved = persisted as PersistedCartState | undefined;
        const gifts = mergeGiftsWithCatalog(saved?.gifts, initialGifts);
        const cart = syncCartWithGifts(saved?.cart, gifts);

        return {
          ...currentState,
          gifts,
          cart,
        };
      },
    }
  )
);
