// Koko Payment Integration for Sri Lanka
// https://koko.lk/developers

interface KokoPaymentRequest {
  amount: number
  currency?: string
  merchantReference: string
  returnUrl: string
  customer: {
    name: string
    phone: string
    email?: string
  }
  items?: {
    name: string
    quantity: number
    price: number
  }[]
}

interface KokoPaymentResponse {
  success: boolean
  paymentUrl?: string
  transactionId?: string
  error?: string
}

const KOKO_MERCHANT_ID = process.env.KOKO_MERCHANT_ID || ''
const KOKO_API_KEY = process.env.KOKO_API_KEY || ''
const KOKO_BASE_URL = process.env.NODE_ENV === 'production'
  ? 'https://app.koko.lk/api/v1'
  : 'https://sandbox.koko.lk/api/v1'

export async function createKokoPayment(orderData: KokoPaymentRequest): Promise<KokoPaymentResponse> {
  if (!KOKO_MERCHANT_ID || !KOKO_API_KEY) {
    return { success: false, error: 'Koko not configured' }
  }

  try {
    const response = await fetch(`${KOKO_BASE_URL}/payments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${KOKO_API_KEY}`,
        'X-Merchant-Id': KOKO_MERCHANT_ID
      },
      body: JSON.stringify({
        amount: orderData.amount,
        currency: orderData.currency || 'LKR',
        merchant_reference: orderData.merchantReference,
        return_url: orderData.returnUrl,
        customer: orderData.customer,
        items: orderData.items,
        installment_plans: [3]
      })
    })

    const data = await response.json()

    if (response.ok && data.payment_url) {
      return {
        success: true,
        paymentUrl: data.payment_url,
        transactionId: data.transaction_id
      }
    }

    return { success: false, error: data.message || 'Payment creation failed' }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

export async function verifyKokoPayment(transactionId: string, signature: string) {
  try {
    const response = await fetch(`${KOKO_BASE_URL}/payments/${transactionId}/verify`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${KOKO_API_KEY}`,
        'X-Signature': signature
      }
    })

    const data = await response.json()
    return { verified: response.ok && data.status === 'paid', data }
  } catch {
    return { verified: false }
  }
}

export function calculateInstallments(total: number, months: number = 3): number[] {
  const installment = Math.ceil(total / months)
  const installments: number[] = []
  let remaining = total

  for (let i = 0; i < months; i++) {
    if (i === months - 1) {
      installments.push(remaining)
    } else {
      installments.push(installment)
      remaining -= installment
    }
  }

  return installments
}