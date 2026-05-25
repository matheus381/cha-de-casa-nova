import { getSupabaseClient } from '@/lib/supabase/client';
import { markGiftsUnavailable } from '@/lib/supabase/gifts';
import { getErrorMessage } from '@/lib/errors';
import type { BuyerInfo, CartItem } from '@/types';

function normalizePhone(phone: string): string {
  return phone.replace(/\D/g, '');
}

export async function createCheckoutOrder(
  buyer: BuyerInfo,
  cart: CartItem[]
): Promise<{ orderId: string }> {
  if (cart.length === 0) {
    throw new Error('Carrinho vazio.');
  }

  const supabase = getSupabaseClient();
  const giftIds = cart.map((item) => item.gift.id).filter
  ((id): id is string => Boolean(id));
  const total = cart.reduce(
    (acc, item) => acc + item.gift.price * item.quantity,
    0
  );

  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert({
      customer_name: buyer.name.trim(),
      phone: normalizePhone(buyer.phone),
      delivery_method: buyer.deliveryMethod,
      total,
    })
    .select('id')
    .single();

  if (orderError || !order) {
    throw new Error(
      getErrorMessage(orderError, 'Não foi possível registrar o pedido.')
    );
  }

  const orderItems = cart.map((item) => ({
    order_id: order.id,
    gift_id: item.gift.id,
    gift_name: item.gift.name,
    price: item.gift.price,
    quantity: item.quantity,
  }));

  const { error: itemsError } = await supabase
    .from('order_items')
    .insert(orderItems);

  if (itemsError) {
    throw new Error(
      getErrorMessage(itemsError, 'Não foi possível salvar os itens do pedido.')
    );
  }

  await markGiftsUnavailable(giftIds);

  return { orderId: order.id };
}
