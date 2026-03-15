/**
 * WhatsApp Notification Service for Aura Home
 * Sends order updates to customers via WhatsApp
 * 
 * Uses WhatsApp Business API or third-party service (e.g., Twilio, MessageBird)
 * For now, uses click-to-chat WhatsApp links for manual sending
 */

export interface WhatsAppConfig {
  phoneNumber: string // Store's WhatsApp number (with country code, e.g., +94771234567)
  businessName: string
  enabled: boolean
}

// Default configuration (can be overridden by environment variables)
const defaultConfig: WhatsAppConfig = {
  phoneNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '+94771234567',
  businessName: 'Aura Home',
  enabled: process.env.NEXT_PUBLIC_WHATSAPP_ENABLED === 'true',
}

/**
 * Generate WhatsApp message for order confirmation
 */
export function generateOrderConfirmationMessage(order: {
  orderNumber: string
  customerName: string
  items: Array<{ name: string; quantity: number; price: number }>
  total: number
  shippingFee: number
  paymentMethod: string
  shippingAddress: string
  shippingCity: string
  shippingPhone: string
  deliveryDate?: string
  deliveryTimeSlot?: string
}): string {
  const itemsList = order.items
    .map(item => `• ${item.name} x${item.quantity} - LKR ${item.price.toLocaleString()}`)
    .join('\n')

  const deliveryInfo = order.deliveryDate 
    ? `\n📅 *Delivery Date:* ${new Date(order.deliveryDate).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })}${order.deliveryTimeSlot ? `\n⏰ *Time Slot:* ${order.deliveryTimeSlot}` : ''}`
    : ''

  const message = `🎉 *Order Confirmed - ${order.orderNumber}*

Thank you for shopping with ${defaultConfig.businessName}!

*Order Details:*
${itemsList}

*Order Summary:*
Subtotal: LKR ${order.total.toLocaleString()}
Shipping: LKR ${order.shippingFee.toLocaleString()}
*Total: LKR ${(order.total + order.shippingFee).toLocaleString()}*

*Payment:* ${order.paymentMethod === 'cod' ? '💵 Cash on Delivery' : '🏦 Koko Installments'}

*Delivery Information:*
👤 ${order.customerName}
📞 ${order.shippingPhone}
📍 ${order.shippingAddress}, ${order.shippingCity}${deliveryInfo}

*Next Steps:*
1. We'll call you to confirm the order
2. Prepare your items for delivery
3. Track your order at aurahomelk.com/account/orders

Thank you for choosing Aura Home! 🏠
`

  return message.trim()
}

/**
 * Generate WhatsApp message for order status update
 */
export function generateOrderStatusUpdateMessage(orderNumber: string, status: string, customerName: string): string {
  const statusMessages: Record<string, { emoji: string; message: string }> = {
    pending: {
      emoji: '⏳',
      message: 'Your order is being processed. We\'ll call you soon to confirm.',
    },
    confirmed: {
      emoji: '✅',
      message: 'Your order has been confirmed and is being prepared.',
    },
    processing: {
      emoji: '📦',
      message: 'Your order is being packed and will be shipped soon.',
    },
    shipped: {
      emoji: '🚚',
      message: 'Your order is on the way! Expected delivery within 1-3 days.',
    },
    delivered: {
      emoji: '🎉',
      message: 'Your order has been delivered successfully. Thank you for shopping with us!',
    },
    cancelled: {
      emoji: '❌',
      message: 'Your order has been cancelled. Please contact us if you have any questions.',
    },
  }

  const statusInfo = statusMessages[status] || {
    emoji: '📢',
    message: `Your order status has been updated to: ${status}`,
  }

  return `*Order Update - ${orderNumber}*

Hi ${customerName},

${statusInfo.emoji} ${statusInfo.message}

Track your order anytime at:
https://aurahomelk.com/account/orders

Questions? Reply to this message or call us!
${defaultConfig.businessName} 🏠
`.trim()
}

/**
 * Generate WhatsApp message for delivery reminder
 */
export function generateDeliveryReminderMessage(orderNumber: string, customerName: string, deliveryDate: string, timeSlot: string): string {
  return `*Delivery Reminder - ${orderNumber}*

Hi ${customerName},

🚚 Your order is scheduled for delivery:

📅 *Date:* ${new Date(deliveryDate).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })}
⏰ *Time:* ${timeSlot}

Please ensure someone is available to receive the order.

Questions? Reply to this message!
${defaultConfig.businessName} 🏠
`.trim()
}

/**
 * Create WhatsApp click-to-chat link
 * Opens WhatsApp with pre-filled message
 */
export function createWhatsAppLink(phoneNumber: string, message: string): string {
  const encodedMessage = encodeURIComponent(message)
  const cleanPhoneNumber = phoneNumber.replace(/[^0-9+]/g, '')
  
  // Remove leading + for WhatsApp API
  const whatsappNumber = cleanPhoneNumber.startsWith('+') 
    ? cleanPhoneNumber.slice(1) 
    : cleanPhoneNumber
  
  return `https://wa.me/${whatsappNumber}?text=${encodedMessage}`
}

/**
 * Send WhatsApp notification (manual - opens WhatsApp)
 * For automated sending, integrate with WhatsApp Business API
 */
export function sendWhatsAppNotification(phoneNumber: string, message: string): void {
  const link = createWhatsAppLink(phoneNumber, message)
  
  // Open in new tab (for admin use)
  if (typeof window !== 'undefined') {
    window.open(link, '_blank')
  } else {
    console.log('WhatsApp link:', link)
  }
}

/**
 * Get customer's WhatsApp number from phone
 * Converts Sri Lankan format to international format
 */
export function formatPhoneNumberForWhatsApp(phone: string): string {
  const cleaned = phone.replace(/\s/g, '')
  
  // If already has country code
  if (cleaned.startsWith('+94')) {
    return cleaned
  }
  
  // If starts with 0 (local format), convert to +94
  if (cleaned.startsWith('0')) {
    return '+94' + cleaned.slice(1)
  }
  
  // If starts with 94, add +
  if (cleaned.startsWith('94')) {
    return '+' + cleaned
  }
  
  // Default: assume it's local format without leading 0
  return '+94' + cleaned
}

/**
 * Check if WhatsApp notifications are enabled
 */
export function isWhatsAppEnabled(): boolean {
  return defaultConfig.enabled
}

/**
 * Get WhatsApp configuration
 */
export function getWhatsAppConfig(): WhatsAppConfig {
  return defaultConfig
}
