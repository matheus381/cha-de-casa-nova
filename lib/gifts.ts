import { Gift, GiftCategory } from '@/types';

export type GiftSeed = Omit<Gift, 'description' | 'purchaseLink'> &
  Partial<Pick<Gift, 'description' | 'purchaseLink'>>;

export function normalizeGift(gift: GiftSeed): Gift {
  return {
    id: gift.id,
    name: gift.name,
    price: gift.price,
    image: gift.image,
    category: gift.category,
    available: gift.available ?? true,
    description: gift.description ?? '',
    purchaseLink: gift.purchaseLink ?? '',
  };
}

export function createGiftId(category: GiftCategory, name: string): string {
  const slug = `${category}-${name}`
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

  return `${slug}-${Date.now().toString(36)}`;
}

/** Persisted catalog is source of truth; seed only adds missing default gifts. */
export function mergeGiftsWithCatalog(persisted: Gift[] | undefined, catalog: Gift[]): Gift[] {
  if (!persisted?.length) return catalog.map(normalizeGift);

  const persistedById = new Map(persisted.map((gift) => [gift.id, normalizeGift(gift)]));
  const merged = persisted.map(normalizeGift);

  for (const catalogGift of catalog) {
    if (!persistedById.has(catalogGift.id)) {
      merged.push(normalizeGift(catalogGift));
    }
  }

  return merged;
}
