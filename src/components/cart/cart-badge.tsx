'use client'

import { ShoppingCart } from 'lucide-react'
import { useCartStore } from '@/lib/store/cart'
import { cn } from '@/lib/utils'

interface CartBadgeProps {
  className?: string
}

export function CartBadge({ className }: CartBadgeProps) {
  const { items, openCart, getTotalItems } = useCartStore()
  const totalItems = getTotalItems()
  
  return (
    <button
      onClick={openCart}
      className={cn(
        "relative p-2 rounded-full hover:bg-sage-100 transition-colors",
        className
      )}
      aria-label="Open cart"
    >
      <ShoppingCart className="w-6 h-6 text-wood-700" />
      
      {/* Badge */}
      {totalItems > 0 && (
        <span
          className={cn(
            "absolute -top-1 -right-1 min-w-[20px] h-5 px-1.5 rounded-full",
            "bg-forest-600 text-white text-xs font-semibold",
            "flex items-center justify-center",
            "animate-in zoom-in duration-200"
          )}
        >
          {totalItems > 99 ? '99+' : totalItems}
        </span>
      )}
    </button>
  )
}