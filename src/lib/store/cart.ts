import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface CartItem {
  id: string
  productId: string
  name: string
  price: number
  salePrice?: number
  image: string
  quantity: number
  stock: number
}

interface CartStore {
  items: CartItem[]
  isOpen: boolean
  addItem: (item: CartItem) => void
  removeItem: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  toggleCart: () => void
  openCart: () => void
  closeCart: () => void
  getTotalItems: () => number
  getTotalPrice: () => number
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      
      addItem: (item) => set((state) => {
        const existing = state.items.find((i) => i.productId === item.productId)
        if (existing) {
          const newQuantity = Math.min(existing.quantity + item.quantity, item.stock)
          return {
            items: state.items.map((i) =>
              i.productId === item.productId
                ? { ...i, quantity: newQuantity }
                : i
            ),
          }
        }
        return { items: [...state.items, item] }
      }),
      
      removeItem: (productId) => set((state) => ({
        items: state.items.filter((i) => i.productId !== productId),
      })),
      
      updateQuantity: (productId, quantity) => set((state) => {
        const item = state.items.find((i) => i.productId === productId)
        if (!item) return state
        
        const validQuantity = Math.max(1, Math.min(quantity, item.stock))
        return {
          items: state.items.map((i) =>
            i.productId === productId ? { ...i, quantity: validQuantity } : i
          ),
        }
      }),
      
      clearCart: () => set({ items: [] }),
      
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
      
      openCart: () => set({ isOpen: true }),
      
      closeCart: () => set({ isOpen: false }),
      
      getTotalItems: () => get().items.reduce((sum, item) => sum + item.quantity, 0),
      
      getTotalPrice: () => get().items.reduce((sum, item) => {
        const price = item.salePrice || item.price
        return sum + price * item.quantity
      }, 0),
    }),
    {
      name: 'aura-cart',
    }
  )
)