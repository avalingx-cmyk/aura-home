'use client'

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { CheckCircle, ShoppingBag, Home, Share2, Copy, MessageCircle } from 'lucide-react'
import { Order } from '@/lib/store/checkout'
import { getOrderByOrderId, getEstimatedDelivery, generateWhatsAppMessage } from '@/lib/services/orders'
import { Button } from '@/components/ui/button'
import { formatPrice } from '@/lib/utils'
import Image from 'next/image'

export default function OrderConfirmationPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [order, setOrder] = useState<Order | null>(null)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const orderId = searchParams.get('orderId')
    if (orderId) {
      const foundOrder = getOrderByOrderId(orderId)
      if (foundOrder) {
        setOrder(foundOrder)
      } else {
        // Order not found, redirect to home
        router.push('/')
      }
    } else {
      // No order ID, redirect to home
      router.push('/')
    }
  }, [searchParams, router])

  const handleCopyOrderId = () => {
    if (order) {
      navigator.clipboard.writeText(order.orderId)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleShareWhatsApp = () => {
    if (order) {
      const message = generateWhatsAppMessage(order)
      // Aura Home WhatsApp number (placeholder)
      const phoneNumber = '94771234567' // Replace with actual business number
      window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank')
    }
  }

  if (!order) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-pulse text-sage-500">Loading order details...</div>
      </div>
    )
  }

  const estimatedDelivery = getEstimatedDelivery()

  return (
    <div className="min-h-screen bg-sage-50/30 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-forest-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-12 h-12 text-forest-600" />
          </div>
          <h1 className="text-3xl font-bold text-wood-900 mb-2">
            Order Confirmed!
          </h1>
          <p className="text-sage-600">
            Thank you for your order. We&apos;ll call you shortly to confirm delivery details.
          </p>
        </div>

        {/* Order ID */}
        <div className="bg-white rounded-xl shadow-sm border border-sage-100 p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-sage-500 mb-1">Order Number</p>
              <p className="text-2xl font-bold text-wood-900">{order.orderId}</p>
            </div>
            <button
              onClick={handleCopyOrderId}
              className="flex items-center gap-2 px-4 py-2 text-sm text-forest-600 hover:bg-forest-50 rounded-lg transition-colors"
            >
              <Copy className="w-4 h-4" />
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
        </div>

        {/* Order Details */}
        <div className="bg-white rounded-xl shadow-sm border border-sage-100 p-6 mb-6">
          <h2 className="text-lg font-semibold text-wood-900 mb-4">Order Details</h2>
          
          {/* Items */}
          <div className="space-y-4 mb-6">
            {order.items.map((item) => {
              const price = item.salePrice || item.price
              return (
                <div key={item.id} className="flex gap-4">
                  <div className="w-16 h-16 bg-sage-100 rounded-lg overflow-hidden flex-shrink-0 relative">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-wood-900">{item.name}</h3>
                    <p className="text-sm text-sage-500">Qty: {item.quantity}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-wood-900">
                      Rs. {formatPrice(price * item.quantity)}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Totals */}
          <div className="border-t border-sage-200 pt-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-sage-600">Subtotal</span>
              <span className="text-wood-900">Rs. {formatPrice(order.subtotal)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-sage-600">Shipping</span>
              <span className={order.shippingCost === 0 ? "text-forest-600 font-medium" : "text-wood-900"}>
                {order.shippingCost === 0 ? 'FREE' : `Rs. ${formatPrice(order.shippingCost)}`}
              </span>
            </div>
            <div className="flex justify-between text-lg font-semibold pt-2 border-t border-sage-200">
              <span className="text-wood-900">Total</span>
              <span className="text-wood-900">Rs. {formatPrice(order.total)}</span>
            </div>
          </div>
        </div>

        {/* Shipping Info */}
        <div className="bg-white rounded-xl shadow-sm border border-sage-100 p-6 mb-6">
          <h2 className="text-lg font-semibold text-wood-900 mb-4">Delivery Information</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-medium text-sage-500 mb-2">Shipping Address</h3>
              <p className="text-wood-900">{order.shippingInfo.fullName}</p>
              <p className="text-sage-600">{order.shippingInfo.phone}</p>
              {order.shippingInfo.email && (
                <p className="text-sage-600">{order.shippingInfo.email}</p>
              )}
              <p className="text-sage-600 mt-1">
                {order.shippingInfo.address}
                <br />
                {order.shippingInfo.city}
                {order.shippingInfo.postalCode && ` ${order.shippingInfo.postalCode}`}
              </p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-sage-500 mb-2">Estimated Delivery</h3>
              <p className="text-wood-900 font-medium">{estimatedDelivery}</p>
              <p className="text-sage-600 text-sm mt-1">3-5 business days</p>
              
              <h3 className="text-sm font-medium text-sage-500 mt-4 mb-2">Payment Method</h3>
              <p className="text-wood-900">
                {order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Koko'}
              </p>
            </div>
          </div>

          {order.shippingInfo.notes && (
            <div className="mt-4 pt-4 border-t border-sage-200">
              <h3 className="text-sm font-medium text-sage-500 mb-2">Order Notes</h3>
              <p className="text-wood-900">{order.shippingInfo.notes}</p>
            </div>
          )}
        </div>

        {/* Contact Info */}
        <div className="bg-forest-50 rounded-xl p-6 mb-6">
          <h2 className="text-lg font-semibold text-wood-900 mb-2">Need Help?</h2>
          <p className="text-sage-600 mb-4">
            Our team will call you within 24 hours to confirm your order. If you have any questions, feel free to reach out.
          </p>
          <div className="flex flex-wrap gap-3">
            <a
              href="tel:+94771234567"
              className="inline-flex items-center gap-2 px-4 py-2 bg-white text-wood-900 rounded-lg hover:bg-sage-50 transition-colors"
            >
              📞 +94 77 123 4567
            </a>
            <a
              href="mailto:hello@aurahomelk.com"
              className="inline-flex items-center gap-2 px-4 py-2 bg-white text-wood-900 rounded-lg hover:bg-sage-50 transition-colors"
            >
              ✉️ hello@aurahomelk.com
            </a>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={handleShareWhatsApp}
            className="flex-1 flex items-center justify-center gap-2 py-3 px-6 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
          >
            <MessageCircle className="w-5 h-5" />
            Share via WhatsApp
          </button>
          
          <Link href="/products" className="flex-1">
            <Button variant="secondary" className="w-full py-3 px-6">
              <ShoppingBag className="w-5 h-5 mr-2" />
              Continue Shopping
            </Button>
          </Link>
        </div>

        <div className="text-center mt-8">
          <Link href="/" className="text-sage-500 hover:text-wood-900 text-sm inline-flex items-center gap-2">
            <Home className="w-4 h-4" />
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}