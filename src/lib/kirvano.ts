// Integração com Kirvano - Gateway de Pagamento

export type KirvanoCheckoutData = {
  amount: number;
  description: string;
  customerEmail?: string;
  customerName?: string;
  items?: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  metadata?: Record<string, any>;
};

export type KirvanoCheckoutResponse = {
  checkoutUrl: string;
  transactionId: string;
  status: string;
};

/**
 * Cria uma sessão de checkout na Kirvano
 */
export async function createKirvanoCheckout(
  data: KirvanoCheckoutData
): Promise<KirvanoCheckoutResponse> {
  const apiKey = process.env.NEXT_PUBLIC_KIRVANO_API_KEY;
  const apiUrl = process.env.NEXT_PUBLIC_KIRVANO_API_URL || 'https://api.kirvano.com.br/v1';

  if (!apiKey) {
    throw new Error('Kirvano API Key não configurada');
  }

  try {
    const response = await fetch(`${apiUrl}/checkout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        amount: Math.round(data.amount * 100), // Converter para centavos
        description: data.description,
        customer: {
          email: data.customerEmail,
          name: data.customerName,
        },
        items: data.items,
        metadata: data.metadata,
        success_url: `${window.location.origin}/success`,
        cancel_url: `${window.location.origin}/`,
      }),
    });

    if (!response.ok) {
      throw new Error('Erro ao criar checkout na Kirvano');
    }

    const result = await response.json();
    
    return {
      checkoutUrl: result.checkout_url || result.url,
      transactionId: result.id || result.transaction_id,
      status: result.status,
    };
  } catch (error) {
    console.error('Erro na integração Kirvano:', error);
    throw error;
  }
}

/**
 * Verifica o status de uma transação
 */
export async function checkKirvanoTransaction(transactionId: string) {
  const apiKey = process.env.NEXT_PUBLIC_KIRVANO_API_KEY;
  const apiUrl = process.env.NEXT_PUBLIC_KIRVANO_API_URL || 'https://api.kirvano.com.br/v1';

  if (!apiKey) {
    throw new Error('Kirvano API Key não configurada');
  }

  try {
    const response = await fetch(`${apiUrl}/transactions/${transactionId}`, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
      },
    });

    if (!response.ok) {
      throw new Error('Erro ao verificar transação');
    }

    return await response.json();
  } catch (error) {
    console.error('Erro ao verificar transação:', error);
    throw error;
  }
}

/**
 * Webhook handler para notificações da Kirvano
 */
export function validateKirvanoWebhook(signature: string, payload: string): boolean {
  const webhookSecret = process.env.KIRVANO_WEBHOOK_SECRET;
  
  if (!webhookSecret) {
    console.warn('Webhook secret não configurado');
    return false;
  }

  // Implementar validação de assinatura conforme documentação Kirvano
  // Exemplo: HMAC SHA256
  return true;
}
