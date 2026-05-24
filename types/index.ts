export const GIFT_CATEGORIES = [
  'Cozinha',
  'Banheiro',
  'Sala de Estar',
  'Quarto',
  'Presentes Especiais',
] as const;

export type GiftCategory = (typeof GIFT_CATEGORIES)[number];

export interface Gift {
  id: string;
  name: string;
  price: number;
  image: string;
  category: GiftCategory;
  available: boolean;
  description: string;
  purchaseLink: string;
}

export type DeliveryMethod = 'hands' | 'surprise' | 'online';

export interface BuyerInfo {
  name: string;
  phone: string;
  deliveryMethod: DeliveryMethod;
}

export interface CartItem {
  gift: Gift;
  quantity: number;
}
