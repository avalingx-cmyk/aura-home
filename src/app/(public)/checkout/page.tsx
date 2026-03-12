'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Loader2, Lock } from 'lucide-react'
import { useCartStore } from '@/lib/store/cart'
import { useCheckoutStore, ShippingInfo } from '@/lib/store/checkout'
import { useToastStore } from '@/lib/store/toast'
import { ShippingForm, PaymentMethod, OrderSummary, CheckoutProgress } from '@/components/checkout'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export default function CheckoutPage() {
  const router = useRouter()
  const { items, clearCart } = useCartStore()
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const { shippingInfo, setShippingInfo, paymentMethod, setPaymentMethod, processOrder, isProcessing } = useCheckoutStore()
  const { addToast } = useToastStore()
  
  const [step, setStep] = useState<'details' | 'payment'>(
    shippingInfo ? 'payment' : 'details'
  )

  // Redirect if cart is empty
  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-wood-900 mb-4">Your Cart is Empty</h1>
          <p className="text-sage-600 mb-6">
            Add some items to your cart before checking out.
          </p>
          <Button onClick={() => router.push('/products')}>
            Browse Products
          </Button>
        </div>
      </div>
    )
  }

  const handleShippingSubmit = (info: ShippingInfo) => {
    setShippingInfo(info)
    setStep('payment')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handlePlaceOrder = async () => {
    try {
      const orderId = await processOrder()
      if (orderId) {
        addToast({
          message: 'Order placed successfully!',
          type: 'success',
        })
        router.push(`/checkout/confirmation?orderId=${orderId}`)
      }
    } catch (error) {
      addToast({
        message: 'Failed to place order. Please try again.',
        type: 'error',
      })
    }
  }

  const subtotal = total
  const shippingCost = subtotal >= 25000 ? 0 : 500
  const orderTotal = subtotal + shippingCost

  return (
    <div className="min-h-screen bg-sage-50/30">
      {/* Header */}
      <div className="bg-white border-b border-sage-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => router.push('/products')}
              className="flex items-center gap-2 text-sage-600 hover:text-wood-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Continue Shopping</span>
            </button>
            <div className="flex items-center gap-2 text-sage-500">
              <Lock className="w-4 h-4" />
              <span className="text-sm">Secure Checkout</span>
            </div>
          </div>
          
          {/* Progress */}
          <CheckoutProgress currentStep={step === 'details' ? 'details' : 'details'} />
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column - Form */}
          <div className="order-2 lg:order-1">
            {/* Step Indicator */}
            <div className="bg-white rounded-xl shadow-sm border border-sage-100 overflow-hidden mb-6">
              <div className="flex border-b border-sage-100">
                <button
                  onClick={() => setStep('details')}
                  className={cn(
                    "flex-1 py-4 px-6 text-sm font-medium transition-colors",
                    step === 'details'
                      ? "bg-forest-50 text-forest-700 border-b-2 border-forest-500"
                      : "text-sage-600 hover:text-wood-900"
                  )}
                >
                  1. Shipping Details
                </button>
                <button
                  onClick={() => shippingInfo && setStep('payment')}
                  disabled={!shippingInfo}
                  className={cn(
                    "flex-1 py-4 px-6 text-sm font-medium transition-colors",
                    step === 'payment'
                      ? "bg-forest-50 text-forest-700 border-b-2 border-forest-500"
                      : shippingInfo
                      ? "text-sage-600 hover:text-wood-900"
                      : "text-sage-400 cursor-not-allowed"
                  )}
                >
                  2. Payment
                </button>
              </div>

              {/* Details Step */}
              {step === 'details' && (
                <div className="p-6">
                  <h2 className="text-xl font-semibold text-wood-900 mb-6">
                    Where should we deliver your order?
                  </h2>
                  <ShippingForm
                    initialData={shippingInfo}
                    onSubmit={handleShippingSubmit}
                    isProcessing={isProcessing}
                  />
                </div>
              )}

              {/* Payment Step */}
              {step === 'payment' && (
                <div className="p-6">
                  {/* Shipping Info Summary */}
                  {shippingInfo && (
                    <div className="mb-6 p-4 bg-sage-50 rounded-lg">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-medium text-wood-900">{shippingInfo.fullName}</h3>
                          <p className="text-sm text-sage-600">{shippingInfo.phone}</p>
                          <p className="text-sm text-sage-600 mt-1">
                            {shippingInfo.address}, {shippingInfo.city}
                          </p>
                        </div>
                        <button
                          onClick={() => setStep('details')}
                          className="text-sm text-forest-600 hover:text-forest-700"
                        >
                          Edit
                        </button>
                      </div>
                    </div>
                  )}

                  <PaymentMethod
                    selected={paymentMethod}
                    onSelect={setPaymentMethod}
                    disabled={isProcessing}
                  />

                  {/* Place Order Button */}
                  <div className="mt-8 space-y-4">
                    <button
                      onClick={handlePlaceOrder}
                      disabled={isProcessing || paymentMethod === 'koko'}
                      className={cn(
                        "w-full py-4 rounded-lg font-semibold text-white transition-colors",
                        isProcessing || paymentMethod === 'koko'
                          ? "bg-sage-400 cursor-not-allowed"
                          : "bg-forest-600 hover:bg-forest-700"
                      )}
                    >
                      {isProcessing ? (
                        <span className="flex items-center justify-center gap-2">
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Processing...
                        </span>
                      ) : paymentMethod === 'koko' ? (
                        'Koko Payment Coming Soon'
                      ) : (
                        `Place Order • Rs. ${orderTotal.toLocaleString()}`
                      )}
                    </button>

                    <p className="text-xs text-center text-sage-500">
                      By placing your order, you agree to our{' '}
                      <a href="/terms" className="text-forest-600 hover:underline">
                        Terms of Service
                      </a>{' '}
                      and{' '}
                      <a href="/privacy" className="text-forest-600 hover:underline">
                        Privacy Policy
                      </a>
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div className="order-1 lg:order-2">
            <div className="sticky top-24">
              <OrderSummary />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}