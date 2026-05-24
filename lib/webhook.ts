import { BuyerInfo, CartItem } from '@/types';

export async function submitGiftSelection(buyer: BuyerInfo, items: CartItem[]) {
  // Configurado para ler variáveis de ambiente do Next.js
  const WEBHOOK_URL = process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL || '';
  
  const payload = {
    buyer: {
      name: buyer.name,
      phone: buyer.phone,
      deliveryMethod: buyer.deliveryMethod === 'hands' 
        ? 'Entrega em mãos' 
        : buyer.deliveryMethod === 'surprise' 
          ? 'Presente surpresa' 
          : 'Compra online',
    },
    items: items.map((item) => ({
      id: item.gift.id,
      name: item.gift.name,
      price: item.gift.price,
      category: item.gift.category,
    })),
    totalPrice: items.reduce((acc, item) => acc + item.gift.price * item.quantity, 0),
    timestamp: new Date().toISOString(),
  };

  // Log para depuração fácil no console do navegador
  console.log('[Webhook] Payload estruturado para envio:', payload);

  if (!WEBHOOK_URL) {
    console.warn(
      '[Webhook] NEXT_PUBLIC_N8N_WEBHOOK_URL não definida. Simulando envio para o n8n...'
    );
    // Simula latência de rede de 1.5 segundos para mostrar o loading spinner
    await new Promise((resolve) => setTimeout(resolve, 1500));
    return { success: true, mock: true };
  }

  try {
    const response = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`Erro na resposta do Webhook: ${response.status} ${response.statusText}`);
    }

    // Tenta obter retorno JSON se houver
    const data = await response.json().catch(() => ({}));
    return { success: true, data };
  } catch (error) {
    console.error('[Webhook] Falha ao enviar para o n8n:', error);
    throw error;
  }
}
