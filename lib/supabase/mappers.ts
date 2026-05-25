import type { GiftRow, GiftInsert, GiftUpdate } from '@/types/database';
import type { Gift, GiftCategory } from '@/types';
import type { GiftFormValues } from '@/lib/schemas/gift-form-schema';

export function rowToGift(row: GiftRow): Gift {
  return {
    id: row.id,
    name: row.name,
    price: Number(row.price),
    image: row.image,
    category: row.category as GiftCategory,
    available: row.available,
    description: row.description ?? '',
    purchaseLink: row.purchase_link ?? '',
  };
}

export function giftFormToInsert(values: GiftFormValues): GiftInsert {
  return {
    name: values.name.trim(),
    price: values.price,
    image: values.image.trim(),
    category: values.category,
    available: values.available,
    description: values.description.trim(),
    purchase_link: values.purchaseLink.trim(),
  };
}

export function giftFormToUpdate(values: GiftFormValues): GiftUpdate {
  return {
    name: values.name.trim(),
    price: values.price,
    image: values.image.trim(),
    category: values.category,
    available: values.available,
    description: values.description.trim(),
    purchase_link: values.purchaseLink.trim(),
    updated_at: new Date().toISOString(),
  };
}

export function partialGiftToUpdate(updates: Partial<Gift>): GiftUpdate {
  const mapped: GiftUpdate = { updated_at: new Date().toISOString() };

  if (updates.name !== undefined) mapped.name = updates.name;
  if (updates.price !== undefined) mapped.price = updates.price;
  if (updates.image !== undefined) mapped.image = updates.image;
  if (updates.category !== undefined) mapped.category = updates.category;
  if (updates.available !== undefined) mapped.available = updates.available;
  if (updates.description !== undefined) mapped.description = updates.description;
  if (updates.purchaseLink !== undefined) mapped.purchase_link = updates.purchaseLink;

  return mapped;
}
