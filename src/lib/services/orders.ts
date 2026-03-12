import { Order, OrderItem, ShippingInfo } from '@/lib/store/checkout'

const ORDERS_STORAGE_KEY = 'aura-orders'

export function generateOrderId(): string {
  const now = new Date()
  const dateStr = now.toISOString().slice(0, 10).replace(/-/g, '')
  const randomStr = Math.random().toString(36).substring(2, 6).toUpperCase()
  return `AH-${dateStr}-${randomStr}`
}

export function getOrders(): Order[] {
  try {
    const stored = localStorage.getItem(ORDERS_STORAGE_KEY)
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

export function getOrderByOrderId(orderId: string): Order | null {
  const orders = getOrders()
  return orders.find(order => order.orderId === orderId) || null
}

export function createOrder(
  items: OrderItem[],
  shippingInfo: ShippingInfo,
  paymentMethod: 'cod' | 'koko'
): Order {
  const subtotal = items.reduce((sum, item) => {
    const price = item.salePrice || item.price
    return sum + (price * item.quantity)
  }, 0)
  
  const shippingCost = subtotal >= 25000 ? 0 : 500
  const total = subtotal + shippingCost

  const order: Order = {
    orderId: generateOrderId(),
    items,
    shippingInfo,
    paymentMethod,
    subtotal,
    shippingCost,
    total,
    status: 'pending',
    createdAt: new Date().toISOString(),
  }

  // Save to localStorage
  const orders = getOrders()
  orders.push(order)
  localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders))

  return order
}

export function updateOrderStatus(orderId: string, status: Order['status']): Order | null {
  const orders = getOrders()
  const orderIndex = orders.findIndex(o => o.orderId === orderId)
  
  if (orderIndex === -1) return null
  
  orders[orderIndex] = {
    ...orders[orderIndex],
    status,
  }
  
  localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders))
  return orders[orderIndex]
}

export function getEstimatedDelivery(): string {
  const today = new Date()
  const minDays = 3
  const maxDays = 5
  
  const minDate = new Date(today)
  minDate.setDate(today.getDate() + minDays)
  
  const maxDate = new Date(today)
  maxDate.setDate(today.getDate() + maxDays)
  
  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }
  
  return `${formatDate(minDate)} - ${formatDate(maxDate)}`
}

export function generateWhatsAppMessage(order: Order): string {
  const itemsList = order.items
    .map(item => `• ${item.name} x${item.quantity} - Rs. ${(item.salePrice || item.price).toLocaleString()}`)
    .join('\n')
  
  const message = `🛒 *New Order - ${order.orderId}*

*Items:*
${itemsList}

*Shipping:*
Name: ${order.shippingInfo.fullName}
Phone: ${order.shippingInfo.phone}
Address: ${order.shippingInfo.address}, ${order.shippingInfo.city}

*Order Summary:*
Subtotal: Rs. ${order.subtotal.toLocaleString()}
Shipping: ${order.shippingCost === 0 ? 'FREE' : `Rs. ${order.shippingCost.toLocaleString()}`}
Total: Rs. ${order.total.toLocaleString()}

Payment: ${order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Koko'}`

  return encodeURIComponent(message)
}