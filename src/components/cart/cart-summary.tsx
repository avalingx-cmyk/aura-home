'use client'

import { useRouter } from 'next/navigation'
import { ArrowRight, Tag } from 'lucide-react'
import { useCartStore } from '@/lib/store/cart'
import { cn } from '@/lib/utils'

interface CartSummaryProps {
  showCheckoutButton?: boolean
  className?: string
}

export function CartSummary({ showCheckoutButton = true, className }: CartSummaryProps) {
  const router = useRouter()
  const { items, getTotalItems, getTotalPrice, closeCart } = useCartStore()
  
  const totalItems = getTotalItems()
  const subtotal = getTotalPrice()
  const shipping = subtotal > 25000 ? 0 : 500 // Free shipping over Rs. 25,000
  const total = subtotal + shipping
  
  const handleCheckout = () => {
    closeCart()
    router.push('/checkout')
  }
  
  // Calculate total savings from sale items
  const totalSavings = items.reduce((sum, item) => {
    if (item.salePrice && item.salePrice < item.price) {
      return sum + (item.price - item.salePrice) * item.quantity
    }
    return sum
  }, 0)

  if (items.length === 0) {
    return null
  }

  return (
    <div className={cn("border-t border-sage-200 bg-sage-50/50", className)}>
      {/* Savings Banner */}
      {totalSavings > 0 && (
        <div className="px-4 py-2 bg-green-50 border-b border-green-100">
          <p className="text-sm text-green-700 font-medium text-center">
            🎉 You're saving Rs. {totalSavings.toLocaleString()} on your order!
          </p>
        </div>
      )}
      
      {/* Summary Details */}
      <div className="p-4 space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-sage-600">
            Subtotal ({totalItems} {totalItems === 1 ? 'item' : 'items'})
          </span>
          <span className="font-medium text-wood-900">
            Rs. {subtotal.toLocaleString()}
          </span>
        </div>
        
        <div className="flex justify-between text-sm">
          <span className="text-sage-600">Shipping</span>
          <span className={cn(
            "font-medium",
            shipping === 0 ? "text-green-600" : "text-wood-900"
          )}>
            {shipping === 0 ? 'FREE' : `Rs. ${shipping.toLocaleString()}`}
          </span>
        </div>
        
        {shipping > 0 && (
          <p className="text-xs text-sage-500">
            Add Rs. {(25000 - subtotal).toLocaleString()} more for free shipping
          </p>
        )}
        
        <div className="h-px bg-sage-200" />
        
        <div className="flex justify-between">
          <span className="font-semibold text-wood-900">Total</span>
          <span className="font-bold text-lg text-wood-900">
            Rs. {total.toLocaleString()}
          </span>
        </div>
      </div>
      
      {/* Coupon Code */}
      <div className="px-4 pb-4">
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-sage-400" />
            <input
              type="text"
              placeholder="Coupon code"
              className="w-full pl-9 pr-3 py-2 text-sm border border-sage-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-forest-500 focus:border-transparent"
            />
          </div>
          <button className="px-4 py-2 text-sm font-medium text-forest-700 border border-forest-300 rounded-lg hover:bg-forest-50 transition-colors">
            Apply
          </button>
        </div>
      </div>
      
      {/* Checkout Button */}
      {showCheckoutButton && (
        <div className="p-4 pt-0">
          <button
            onClick={handleCheckout}
            className={cn(
              "w-full py-3 px-4 rounded-lg font-semibold",
              "bg-forest-600 text-white",
              "hover:bg-forest-700 active:bg-forest-800",
              "transition-colors duration-200",
              "flex items-center justify-center gap-2"
            )}
          >
            Proceed to Checkout
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  )
}