import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface ShippingInfo {
  fullName: string
  phone: string // Sri Lankan format: 07X XXX XXXX
  email: string
  address: string
  city: string
  postalCode?: string
  notes?: string
  zone?: string // Delivery zone name
  delivery_date?: string // ISO date format (YYYY-MM-DD)
  delivery_time_slot?: string // e.g., "9:00 AM - 12:00 PM"
  whatsappOptIn?: boolean // Opt-in for WhatsApp notifications
}

export interface OrderItem {
  id: string
  productId: string
  name: string
  price: number
  salePrice?: number
  image: string
  quantity: number
}

export interface Order {
  orderId: string
  items: OrderItem[]
  shippingInfo: ShippingInfo
  paymentMethod: 'cod' | 'koko'
  subtotal: number
  shippingCost: number
  total: number
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  createdAt: string
}

interface CheckoutStore {
  shippingInfo: ShippingInfo | null
  paymentMethod: 'cod' | 'koko'
  isProcessing: boolean
  currentOrder: Order | null
  setShippingInfo: (info: ShippingInfo) => void
  setPaymentMethod: (method: 'cod' | 'koko') => void
  processOrder: () => Promise<string | null>
  reset: () => void
}

// Sri Lankan phone validation: 07X XXX XXXX
export const isValidSriLankanPhone = (phone: string): boolean => {
  const cleaned = phone.replace(/\s/g, '')
  return /^07[0-9]{8}$/.test(cleaned)
}

// Format phone for display
export const formatPhone = (phone: string): string => {
  const cleaned = phone.replace(/\s/g, '')
  if (cleaned.length === 10 && cleaned.startsWith('07')) {
    return `${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(6)}`
  }
  return phone
}

// Sri Lankan cities list
export const SRI_LANKAN_CITIES = [
  'Colombo',
  'Dehiwala',
  'Moratuwa',
  'Negombo',
  'Kandy',
  'Galle',
  'Jaffna',
  'Negombo',
  'Anuradhapura',
  'Trincomalee',
  'Batticaloa',
  'Kurunegala',
  'Ratnapura',
  'Badulla',
  'Matara',
  'Kalutara',
  'Nugegoda',
  'Kotte',
  'Maharagama',
  'Kesbewa',
  'Homagama',
  'Kaduwela',
  'Biyagama',
  'Wattala',
  'Gampaha',
  'Ja-Ela',
  'Katunayake',
  'Other',
] as const

export const useCheckoutStore = create<CheckoutStore>()(
  persist(
    (set, get) => ({
      shippingInfo: null,
      paymentMethod: 'cod',
      isProcessing: false,
      currentOrder: null,

      setShippingInfo: (info) => set({ shippingInfo: info }),

      setPaymentMethod: (method) => set({ paymentMethod: method }),

      processOrder: async () => {
        set({ isProcessing: true })

        try {
          // Import cart store dynamically to avoid circular dependency
          const { useCartStore } = await import('./cart')
          const cartState = useCartStore.getState()

          if (cartState.items.length === 0) {
            throw new Error('Cart is empty')
          }

          const { shippingInfo, paymentMethod } = get()

          if (!shippingInfo) {
            throw new Error('Shipping information is required')
          }

          // Calculate totals
          const subtotal = cartState.getTotalPrice()
          const shippingCost = subtotal >= 25000 ? 0 : 500
          const total = subtotal + shippingCost

          // Prepare order data for API
          const orderData = {
            items: cartState.items.map(item => ({
              product_id: item.productId,
              name: item.name,
              price: item.price,
              salePrice: item.salePrice,
              image: item.image,
              quantity: item.quantity,
            })),
            shipping: {
              name: shippingInfo.fullName,
              phone: shippingInfo.phone,
              email: shippingInfo.email,
              address: shippingInfo.address,
              city: shippingInfo.city,
              postal_code: shippingInfo.postalCode,
              zone: shippingInfo.zone,
              delivery_date: shippingInfo.delivery_date,
              delivery_time_slot: shippingInfo.delivery_time_slot,
              whatsapp_opt_in: shippingInfo.whatsappOptIn,
            },
            payment_method: paymentMethod,
            notes: shippingInfo.notes,
          }

          // Call API to create order
          const response = await fetch('/api/orders', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(orderData),
          })

          if (!response.ok) {
            const data = await response.json()
            throw new Error(data.error || 'Failed to create order')
          }

          const data = await response.json()
          const orderNumber = data.order.order_number

          // Create local order object for display
          const order: Order = {
            orderId: orderNumber,
            items: cartState.items.map(item => ({
              id: item.id,
              productId: item.productId,
              name: item.name,
              price: item.price,
              salePrice: item.salePrice,
              image: item.image,
              quantity: item.quantity,
            })),
            shippingInfo,
            paymentMethod,
            subtotal,
            shippingCost,
            total,
            status: 'pending',
            createdAt: new Date().toISOString(),
          }

          // Set current order and clear cart
          set({ currentOrder: order, isProcessing: false })
          cartState.clearCart()

          return orderNumber
        } catch (error) {
          set({ isProcessing: false })
          throw error
        }
      },

      reset: () => {
        set({
          shippingInfo: null,
          paymentMethod: 'cod',
          isProcessing: false,
          currentOrder: null,
        })
      },
    }),
    {
      name: 'aura-checkout',
      partialize: (state) => ({
        shippingInfo: state.shippingInfo,
        paymentMethod: state.paymentMethod,
      }),
    }
  )
)