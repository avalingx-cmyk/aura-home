'use client'

import { X, ShoppingBag, ArrowRight } from 'lucide-react'
import { useCartStore } from '@/lib/store/cart'
import { CartItem } from './cart-item'
import { CartSummary } from './cart-summary'
import { cn } from '@/lib/utils'

export function CartDrawer() {
  const { items, isOpen, closeCart, getTotalItems } = useCartStore()
  const totalItems = getTotalItems()

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 animate-in fade-in duration-200"
        onClick={closeCart}
      />

      {/* Drawer */}
      <div
        className={cn(
          "fixed right-0 top-0 h-full w-full max-w-md bg-white z-50 shadow-2xl flex flex-col",
          "animate-in slide-in-from-right duration-300"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-sage-200 bg-gradient-to-r from-forest-700 to-forest-600">
          <div className="flex items-center gap-3">
            <ShoppingBag className="w-5 h-5 text-white" />
            <h2 className="text-lg font-semibold text-white">
              Your Cart
              {totalItems > 0 && (
                <span className="ml-2 text-sm font-normal text-forest-200">
                  ({totalItems} {totalItems === 1 ? 'item' : 'items'})
                </span>
              )}
            </h2>
          </div>
          <button
            onClick={closeCart}
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
            aria-label="Close cart"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Content */}
        {items.length === 0 ? (
          /* Empty State */
          <div className="flex-1 flex flex-col items-center justify-center p-8">
            <div className="w-32 h-32 bg-sage-100 rounded-full flex items-center justify-center mb-6">
              <ShoppingBag className="w-16 h-16 text-sage-400" />
            </div>
            <h3 className="text-xl font-semibold text-wood-900 mb-2">
              Your cart is empty
            </h3>
            <p className="text-sage-500 text-center mb-6 max-w-xs">
              Looks like you haven't added anything yet. Start shopping to fill your cart with beautiful furniture!
            </p>
            <button
              onClick={closeCart}
              className={cn(
                "px-6 py-3 rounded-lg font-semibold",
                "bg-forest-600 text-white",
                "hover:bg-forest-700 transition-colors",
                "flex items-center gap-2"
              )}
            >
              Continue Shopping
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <>
            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto px-4">
              {items.map((item) => (
                <CartItem key={item.productId} item={item} />
              ))}
            </div>

            {/* Cart Summary */}
            <CartSummary />
          </>
        )}
      </div>
    </>
  )
}