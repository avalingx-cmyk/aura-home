'use client'

import { useCartStore, CartItem } from '@/lib/store/cart'

// Convenience hook for cart operations
export function useCart() {
  const store = useCartStore()
  
  return {
    // State
    items: store.items,
    isOpen: store.isOpen,
    itemCount: store.getTotalItems(),
    totalPrice: store.getTotalPrice(),
    
    // Actions
    addItem: store.addItem,
    removeItem: store.removeItem,
    updateQuantity: store.updateQuantity,
    clearCart: store.clearCart,
    openCart: store.openCart,
    closeCart: store.closeCart,
    toggleCart: store.toggleCart,
    
    // Helpers
    getItem: (productId: string) => store.items.find(item => item.productId === productId),
    hasItem: (productId: string) => store.items.some(item => item.productId === productId),
    getItemQuantity: (productId: string) => {
      const item = store.items.find(item => item.productId === productId)
      return item?.quantity ?? 0
    },
    
    // Utilities
    canAddMore: (productId: string, stock: number) => {
      const item = store.items.find(item => item.productId === productId)
      return !item || item.quantity < stock
    },
    
    // Create cart item from product
    createCartItem: (
      id: string,
      name: string,
      price: number,
      image: string,
      stock: number,
      quantity: number = 1,
      salePrice?: number
    ): CartItem => ({
      id: `${id}-${Date.now()}`,
      productId: id,
      name,
      price,
      salePrice,
      image,
      quantity,
      stock,
    }),
  }
}