'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, ShoppingBag, Clock, Package, CheckCircle, XCircle, TrendingUp } from 'lucide-react'

interface OrderItem {
  id: string
  product_id: string
  product_name: string
  quantity: number
  price: number
  total: number
}

interface Order {
  id: string
  order_number: string
  status: string
  payment_status: string
  payment_method: string
  subtotal: number
  shipping_fee: number
  total: number
  shipping_name: string
  shipping_phone: string
  shipping_address: string
  shipping_city: string
  shipping_zone?: string
  delivery_date?: string
  delivery_time_slot?: string
  notes?: string
  created_at: string
  updated_at: string
  items?: OrderItem[]
}

const statusConfig = {
  pending: { label: 'Pending', color: 'bg-yellow-100 text-yellow-700', icon: Clock },
  processing: { label: 'Processing', color: 'bg-blue-100 text-blue-700', icon: Package },
  shipped: { label: 'Shipped', color: 'bg-purple-100 text-purple-700', icon: TrendingUp },
  delivered: { label: 'Delivered', color: 'bg-green-100 text-green-700', icon: CheckCircle },
  cancelled: { label: 'Cancelled', color: 'bg-red-100 text-red-700', icon: XCircle },
}

export default function OrderDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchOrder = async () => {
      if (!params?.id) return
      
      try {
        const response = await fetch(`/api/orders?id=${params.id}`)
        if (!response.ok) {
          const data = await response.json()
          throw new Error(data.error || 'Order not found')
        }
        const data = await response.json()
        setOrder(data.order)
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchOrder()
  }, [params?.id])

  if (loading) {
    return (
      <div className="text-center py-12">
        <p className="text-wood">Loading order details...</p>
      </div>
    )
  }

  if (error || !order) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 mb-4">{error || 'Order not found'}</p>
        <button
          onClick={() => router.push('/account/orders')}
          className="px-6 py-2 bg-wood text-white rounded-lg hover:bg-wood-dark transition-colors"
        >
          Back to Orders
        </button>
      </div>
    )
  }

  const status = statusConfig[order.status as keyof typeof statusConfig]
  const StatusIcon = status.icon

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => router.push('/account/orders')}
          className="flex items-center gap-2 text-wood hover:text-wood-dark transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>Back to Orders</span>
        </button>
      </div>

      <div>
        <h2 className="text-2xl font-bold text-wood-dark mb-2">
          Order {order.order_number}
        </h2>
        <p className="text-wood">
          Placed on {new Date(order.created_at).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })}
        </p>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-sage-100 p-6">
          <p className="text-sm text-wood mb-2">Order Status</p>
          <div className="flex items-center gap-3">
            <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${status.color}`}>
              <StatusIcon className="h-5 w-5" />
              {status.label}
            </span>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-sage-100 p-6">
          <p className="text-sm text-wood mb-2">Payment Status</p>
          <div className="flex items-center gap-3">
            <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${
              order.payment_status === 'paid' ? 'bg-green-100 text-green-700' :
              order.payment_status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
              'bg-red-100 text-red-700'
            }`}>
              {order.payment_status}
            </span>
            <span className="text-wood uppercase text-sm">
              ({order.payment_method})
            </span>
          </div>
        </div>
      </div>

      {/* Order Items */}
      <div className="bg-white rounded-xl shadow-sm border border-sage-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-sage-100">
          <h3 className="font-semibold text-wood-dark">Order Items</h3>
        </div>
        <div className="p-6">
          {order.items?.map((item) => (
            <div
              key={item.id}
              className="flex justify-between items-center py-4 border-b border-sage-100 last:border-0"
            >
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-lg bg-sage-100 flex items-center justify-center">
                  <ShoppingBag className="h-8 w-8 text-wood" />
                </div>
                <div>
                  <p className="font-medium text-wood-dark">{item.product_name}</p>
                  <p className="text-sm text-wood">
                    Qty: {item.quantity} × LKR {item.price.toLocaleString()}
                  </p>
                </div>
              </div>
              <p className="font-medium text-wood-dark">
                LKR {item.total.toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Order Summary & Shipping */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Order Summary */}
        <div className="bg-white rounded-xl shadow-sm border border-sage-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-sage-100">
            <h3 className="font-semibold text-wood-dark">Order Summary</h3>
          </div>
          <div className="p-6 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-wood">Subtotal</span>
              <span className="text-wood-dark">LKR {order.subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-wood">Shipping Fee</span>
              <span className="text-wood-dark">LKR {order.shipping_fee.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-lg font-bold pt-3 border-t border-sage-100">
              <span className="text-wood-dark">Total</span>
              <span className="text-wood-dark">LKR {order.total.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Shipping Information */}
        <div className="bg-white rounded-xl shadow-sm border border-sage-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-sage-100">
            <h3 className="font-semibold text-wood-dark">Shipping Information</h3>
          </div>
          <div className="p-6 space-y-3 text-sm">
            <div>
              <p className="text-wood mb-1">Name</p>
              <p className="text-wood-dark font-medium">{order.shipping_name}</p>
            </div>
            <div>
              <p className="text-wood mb-1">Phone</p>
              <p className="text-wood-dark font-medium">{order.shipping_phone}</p>
            </div>
            <div>
              <p className="text-wood mb-1">Address</p>
              <p className="text-wood-dark font-medium">{order.shipping_address}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-wood mb-1">City</p>
                <p className="text-wood-dark font-medium">{order.shipping_city}</p>
              </div>
              {order.shipping_zone && (
                <div>
                  <p className="text-wood mb-1">Zone</p>
                  <p className="text-wood-dark font-medium">{order.shipping_zone}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Delivery Info */}
      {(order.delivery_date || order.delivery_time_slot) && (
        <div className="bg-white rounded-xl shadow-sm border border-sage-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-sage-100">
            <h3 className="font-semibold text-wood-dark">Delivery Information</h3>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            {order.delivery_date && (
              <div>
                <p className="text-sm text-wood mb-1">Delivery Date</p>
                <p className="text-wood-dark font-medium">
                  {new Date(order.delivery_date).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
            )}
            {order.delivery_time_slot && (
              <div>
                <p className="text-sm text-wood mb-1">Time Slot</p>
                <p className="text-wood-dark font-medium">{order.delivery_time_slot}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Notes */}
      {order.notes && (
        <div className="bg-white rounded-xl shadow-sm border border-sage-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-sage-100">
            <h3 className="font-semibold text-wood-dark">Customer Notes</h3>
          </div>
          <div className="p-6">
            <p className="text-wood">{order.notes}</p>
          </div>
        </div>
      )}
    </div>
  )
}
