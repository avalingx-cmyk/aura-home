'use client'

import { X, Plus, Minus, ShoppingBag } from 'lucide-react'
import { useCartStore, type CartStore, type CartItem } from '@/lib/store/cart'
import { Button } from '@/components/ui/button'
import { formatPrice } from '@/lib/utils'
import Image from 'next/image'
import Link from 'next/link'

export function CartDrawer() {
  const items = useCartStore((state: CartStore) => state.items)
  const isOpen = useCartStore((state: CartStore) => state.isOpen)
  const toggleCart = useCartStore((state: CartStore) => state.toggleCart)
  const removeItem = useCartStore((state: CartStore) => state.removeItem)
  const updateQuantity = useCartStore((state: CartStore) => state.updateQuantity)
  const getTotal = useCartStore((state: CartStore) => state.getTotal)

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 z-50"
        onClick={toggleCart}
      />

      {/* Drawer */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-warm-white z-50 shadow-large flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-beige">
          <h2 className="text-lg font-semibold text-wood-dark">Your Cart</h2>
          <button onClick={toggleCart} className="p-2 hover:bg-beige rounded-full">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-wood">
              <ShoppingBag className="w-16 h-16 mb-4" />
              <p className="text-lg font-medium">Your cart is empty</p>
              <p className="text-sm mt-1">Add some beautiful furniture!</p>
              <Button className="mt-4" onClick={toggleCart}>
                Continue Shopping
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item: CartItem) => (
                <div key={item.id} className="flex gap-4 bg-beige/50 rounded-2xl p-3">
                  <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-beige">
                    <Image src={item.image} alt={item.name} fill className="object-cover" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-wood-dark">{item.name}</h3>
                    <p className="text-forest font-semibold">{formatPrice(item.price)}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-7 h-7 rounded-full bg-warm-white flex items-center justify-center"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-7 h-7 rounded-full bg-warm-white flex items-center justify-center"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-wood hover:text-red-500"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-beige p-4 space-y-4">
            <div className="flex items-center justify-between text-lg">
              <span className="text-wood">Subtotal</span>
              <span className="font-semibold text-wood-dark">{formatPrice(getTotal())}</span>
            </div>
            <Link href="/checkout" onClick={toggleCart}>
              <Button className="w-full" size="lg">
                Proceed to Checkout
              </Button>
            </Link>
            <p className="text-xs text-center text-wood/60">
              Delivery calculated at checkout
            </p>
          </div>
        )}
      </div>
    </>
  )
}