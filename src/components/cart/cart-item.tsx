'use client'

import Image from 'next/image'
import { Minus, Plus, X } from 'lucide-react'
import { CartItem as CartItemType } from '@/lib/store/cart'
import { useCartStore } from '@/lib/store/cart'
import { cn } from '@/lib/utils'

interface CartItemProps {
  item: CartItemType
}

export function CartItem({ item }: CartItemProps) {
  const { updateQuantity, removeItem } = useCartStore()
  const displayPrice = item.salePrice || item.price
  const hasDiscount = item.salePrice && item.salePrice < item.price
  
  const handleIncrement = () => {
    if (item.quantity < item.stock) {
      updateQuantity(item.productId, item.quantity + 1)
    }
  }
  
  const handleDecrement = () => {
    if (item.quantity > 1) {
      updateQuantity(item.productId, item.quantity - 1)
    }
  }
  
  const savings = hasDiscount
    ? Math.round(((item.price - item.salePrice!) / item.price) * 100)
    : 0

  return (
    <div className="flex gap-4 py-4 border-b border-sage-100 last:border-b-0">
      {/* Product Image */}
      <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-sage-50 flex-shrink-0">
        <Image
          src={item.image}
          alt={item.name}
          fill
          className="object-cover"
          sizes="80px"
        />
      </div>
      
      {/* Product Details */}
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start gap-2">
          <h3 className="text-sm font-medium text-wood-900 truncate pr-2">
            {item.name}
          </h3>
          <button
            onClick={() => removeItem(item.productId)}
            className="text-sage-400 hover:text-red-500 transition-colors flex-shrink-0"
            aria-label="Remove item"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        
        {/* Price */}
        <div className="mt-1 flex items-center gap-2">
          <span className="text-sm font-semibold text-wood-900">
            Rs. {displayPrice.toLocaleString()}
          </span>
          {hasDiscount && (
            <>
              <span className="text-xs text-sage-400 line-through">
                Rs. {item.price.toLocaleString()}
              </span>
              <span className="text-xs text-green-600 font-medium">
                {savings}% off
              </span>
            </>
          )}
        </div>
        
        {/* Quantity Controls */}
        <div className="mt-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={handleDecrement}
              disabled={item.quantity <= 1}
              className={cn(
                "w-7 h-7 rounded-full flex items-center justify-center border transition-colors",
                item.quantity <= 1
                  ? "border-sage-200 text-sage-300 cursor-not-allowed"
                  : "border-sage-300 text-sage-600 hover:border-forest-500 hover:text-forest-500"
              )}
              aria-label="Decrease quantity"
            >
              <Minus className="w-3 h-3" />
            </button>
            <span className="w-8 text-center text-sm font-medium text-wood-900">
              {item.quantity}
            </span>
            <button
              onClick={handleIncrement}
              disabled={item.quantity >= item.stock}
              className={cn(
                "w-7 h-7 rounded-full flex items-center justify-center border transition-colors",
                item.quantity >= item.stock
                  ? "border-sage-200 text-sage-300 cursor-not-allowed"
                  : "border-sage-300 text-sage-600 hover:border-forest-500 hover:text-forest-500"
              )}
              aria-label="Increase quantity"
            >
              <Plus className="w-3 h-3" />
            </button>
          </div>
          
          {/* Stock Warning */}
          {item.quantity >= item.stock && item.stock <= 5 && (
            <span className="text-xs text-amber-600 font-medium">
              Only {item.stock} left
            </span>
          )}
        </div>
        
        {/* Line Total */}
        <div className="mt-2 text-right">
          <span className="text-sm font-semibold text-forest-700">
            Rs. {(displayPrice * item.quantity).toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  )
}