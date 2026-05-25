import { BuyerInfo, CartItem, DeliveryMethod } from '@/types';

const DEFAULT_WEBHOOK_URL =
  'https://mssantos.app.n8n.cloud/webhook-test/gift-checkout';

const DELIVERY_METHOD_LABELS: Record<DeliveryMethod, string> = {
  hands: 'Entrega em mãos',
  surprise: 'Presente surpresa',
  online: 'Compra online',
};

export interface GiftCheckoutPayload {
  name: string;
  phone: string;
  deliveryMethod: string;
  gifts: {
    id: string;
    name: string;
    price: number;
    category: string;
    quantity: number;
  }[];
  total: number;
  timestamp: string;
}

function normalizePhone(phone: string): string {
  return phone.replace(/\D/g, '');
}

function buildCheckoutPayload(
  buyer: BuyerInfo,
  items: CartItem[]
): GiftCheckoutPayload {
  const gifts = items.map((item) => ({
    id: item.gift.id,
    name: item.gift.name,
    price: item.gift.price,
    category: item.gift.category,
    quantity: item.quantity,
  }));

  const total = items.reduce(
    (acc, item) => acc + item.gift.price * item.quantity,
    0
  );

  return {
    name: buyer.name.trim(),
    phone: normalizePhone(buyer.phone),
    deliveryMethod: DELIVERY_METHOD_LABELS[buyer.deliveryMethod],
    gifts,
    total,
    timestamp: new Date().toISOString(),
  };
}

export async function submitGiftSelection(buyer: BuyerInfo, items: CartItem[]) {
  const webhookUrl =
    process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL || DEFAULT_WEBHOOK_URL;
  const payload = buildCheckoutPayload(buyer, items);

  const response = await fetch(webhookUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(
      `Webhook respondeu com erro: ${response.status} ${response.statusText}`
    );
  }

  const data = await response.json().catch(() => ({}));
  return { success: true, data };
}
