'use client'

import { useState } from 'react'
import { ShoppingBag, Truck, Tag, ChevronDown, ChevronUp } from 'lucide-react'
import { useCart } from '@/lib/store/cart'
import { formatPrice } from '@/lib/utils'
import Image from 'next/image'
import { cn } from '@/lib/utils'

interface OrderSummaryProps {
  showItems?: boolean
}

export function OrderSummary({ showItems = true }: OrderSummaryProps) {
  const { items, total, itemCount } = useCart()
  const [showCouponField, setShowCouponField] = useState(false)
  const [couponCode, setCouponCode] = useState('')
  const [isExpanded, setIsExpanded] = useState(true)

  const subtotal = total
  const shippingCost = subtotal >= 25000 ? 0 : 500
  const orderTotal = subtotal + shippingCost
  const freeShippingThreshold = 25000
  const remainingForFreeShipping = freeShippingThreshold - subtotal

  if (items.length === 0) {
    return (
      <div className="bg-sage-50 rounded-lg p-6 text-center">
        <ShoppingBag className="w-12 h-12 text-sage-400 mx-auto mb-3" />
        <p className="text-sage-600">Your cart is empty</p>
      </div>
    )
  }

  return (
    <div className="bg-sage-50 rounded-lg">
      {/* Header */}
      <div className="p-4 border-b border-sage-200">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-wood-900 flex items-center gap-2">
            <ShoppingBag className="w-5 h-5" />
            Order Summary
          </h3>
          <span className="text-sm text-sage-600">{itemCount} items</span>
        </div>
      </div>

      {/* Items */}
      {showItems && (
        <div className={cn("border-b border-sage-200", !isExpanded && "hidden md:block")}>
          {/* Mobile Toggle */}
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-full flex items-center justify-between p-4 text-sm text-forest-600 md:hidden"
          >
            <span>{itemCount} items</span>
            {isExpanded ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </button>

          {/* Items List */}
          <div className={cn("divide-y divide-sage-200", isExpanded ? "block" : "hidden md:block")}>
            {items.map((item) => {
              const price = item.salePrice || item.price
              return (
                <div key={item.id} className="p-4 flex gap-4">
                  {/* Product Image */}
                  <div className="w-16 h-16 bg-sage-100 rounded-lg overflow-hidden flex-shrink-0 relative">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                    {/* Quantity Badge */}
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-forest-600 text-white text-xs rounded-full flex items-center justify-center">
                      {item.quantity}
                    </span>
                  </div>

                  {/* Product Info */}
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-wood-900 truncate">
                      {item.name}
                    </h4>
                    <p className="text-xs text-sage-500 mt-0.5">
                      Qty: {item.quantity}
                    </p>
                    <p className="text-sm font-medium text-wood-900 mt-1">
                      Rs. {formatPrice(price * item.quantity)}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Free Shipping Progress */}
      {remainingForFreeShipping > 0 && (
        <div className="p-4 border-b border-sage-200">
          <div className="flex items-center gap-2 text-sm text-sage-600 mb-2">
            <Truck className="w-4 h-4" />
            <span>Add Rs. {formatPrice(remainingForFreeShipping)} more for FREE delivery!</span>
          </div>
          <div className="w-full h-2 bg-sage-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-forest-500 transition-all duration-500"
              style={{ width: `${Math.min((subtotal / freeShippingThreshold) * 100, 100)}%` }}
            />
          </div>
        </div>
      )}

      {/* Coupon Code */}
      <div className="p-4 border-b border-sage-200">
        {showCouponField ? (
          <div className="space-y-2">
            <div className="flex gap-2">
              <input
                type="text"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                placeholder="Enter coupon code"
                className="flex-1 px-3 py-2 text-sm rounded-lg border border-sage-200 focus:outline-none focus:ring-2 focus:ring-forest-500"
              />
              <button
                type="button"
                className="px-4 py-2 bg-sage-200 text-sage-500 rounded-lg text-sm cursor-not-allowed"
                disabled
              >
                Apply
              </button>
            </div>
            <p className="text-xs text-amber-600">
              Coupon codes coming soon!
            </p>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setShowCouponField(true)}
            className="flex items-center gap-2 text-sm text-forest-600 hover:text-forest-700"
          >
            <Tag className="w-4 h-4" />
            <span>Have a coupon code?</span>
          </button>
        )}
      </div>

      {/* Totals */}
      <div className="p-4 space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-sage-600">Subtotal</span>
          <span className="text-wood-900">Rs. {formatPrice(subtotal)}</span>
        </div>

        <div className="flex justify-between text-sm">
          <span className="text-sage-600 flex items-center gap-1">
            <Truck className="w-4 h-4" />
            Shipping
          </span>
          {shippingCost === 0 ? (
            <span className="text-forest-600 font-medium">FREE</span>
          ) : (
            <span className="text-wood-900">Rs. {formatPrice(shippingCost)}</span>
          )}
        </div>

        {shippingCost === 0 && subtotal >= freeShippingThreshold && (
          <p className="text-xs text-forest-600 text-right">
            🎉 You qualify for free delivery!
          </p>
        )}

        <div className="border-t border-sage-200 pt-3">
          <div className="flex justify-between">
            <span className="font-semibold text-wood-900">Total</span>
            <span className="font-bold text-lg text-wood-900">
              Rs. {formatPrice(orderTotal)}
            </span>
          </div>
          <p className="text-xs text-sage-500 text-right mt-1">
            Inclusive of all taxes
          </p>
        </div>
      </div>
    </div>
  )
}