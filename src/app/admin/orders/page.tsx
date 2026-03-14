'use client'

import { useEffect, useState } from 'react'
import { ShoppingBag, Clock, Package, CheckCircle, XCircle, RefreshCw } from 'lucide-react'

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
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded'
  subtotal: number
  shipping_fee: number
  total: number
  payment_method: 'cod' | 'koko'
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

interface OrderStats {
  pending: number
  processing: number
  shipped: number
  delivered: number
  cancelled: number
}

const statusConfig = {
  pending: { label: 'Pending', color: 'bg-yellow-100 text-yellow-700', icon: Clock },
  processing: { label: 'Processing', color: 'bg-blue-100 text-blue-700', icon: Package },
  shipped: { label: 'Shipped', color: 'bg-purple-100 text-purple-700', icon: Package },
  delivered: { label: 'Delivered', color: 'bg-green-100 text-green-700', icon: CheckCircle },
  cancelled: { label: 'Cancelled', color: 'bg-red-100 text-red-700', icon: XCircle },
}

const paymentStatusConfig = {
  pending: { label: 'Pending', color: 'bg-yellow-100 text-yellow-700' },
  paid: { label: 'Paid', color: 'bg-green-100 text-green-700' },
  failed: { label: 'Failed', color: 'bg-red-100 text-red-700' },
  refunded: { label: 'Refunded', color: 'bg-gray-100 text-gray-700' },
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [stats, setStats] = useState<OrderStats>({
    pending: 0,
    processing: 0,
    shipped: 0,
    delivered: 0,
    cancelled: 0,
  })
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [updating, setUpdating] = useState(false)

  // Fetch orders from API
  const fetchOrders = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch('/api/orders')
      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to fetch orders')
      }
      const data = await response.json()
      setOrders(data.orders || [])
      
      // Calculate stats
      const stats = (data.orders || []).reduce((acc: OrderStats, order: Order) => {
        acc[order.status as keyof OrderStats] = (acc[order.status as keyof OrderStats] || 0) + 1
        return acc
      }, { pending: 0, processing: 0, shipped: 0, delivered: 0, cancelled: 0 })
      setStats(stats)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchOrders()
  }, [])

  // Update order status
  const updateOrderStatus = async (orderId: string, newStatus: Order['status']) => {
    try {
      setUpdating(true)
      const response = await fetch('/api/orders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: orderId, status: newStatus }),
      })
      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to update order')
      }
      
      // Refresh orders
      await fetchOrders()
      setShowModal(false)
      setSelectedOrder(null)
    } catch (err: any) {
      alert(`Failed to update order: ${err.message}`)
    } finally {
      setUpdating(false)
    }
  }

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  // Open order details modal
  const openOrderDetails = (order: Order) => {
    setSelectedOrder(order)
    setShowModal(true)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <RefreshCw className="h-8 w-8 animate-spin text-wood" />
        <p className="ml-3 text-wood">Loading orders...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="text-red-600 mb-4">{error}</p>
        <button
          onClick={fetchOrders}
          className="px-4 py-2 bg-wood text-white rounded-lg hover:bg-wood-dark transition-colors"
        >
          Retry
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-wood-dark">Orders</h1>
          <p className="text-wood">Manage customer orders</p>
        </div>
        <button
          onClick={fetchOrders}
          className="flex items-center gap-2 px-4 py-2 bg-wood text-white rounded-lg hover:bg-wood-dark transition-colors"
        >
          <RefreshCw className="h-4 w-4" />
          Refresh
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="rounded-xl bg-warm-white border border-beige-dark p-4">
          <p className="text-sm text-wood">Pending</p>
          <p className="text-2xl font-bold text-yellow-700">{stats.pending}</p>
        </div>
        <div className="rounded-xl bg-warm-white border border-beige-dark p-4">
          <p className="text-sm text-wood">Processing</p>
          <p className="text-2xl font-bold text-blue-700">{stats.processing}</p>
        </div>
        <div className="rounded-xl bg-warm-white border border-beige-dark p-4">
          <p className="text-sm text-wood">Shipped</p>
          <p className="text-2xl font-bold text-purple-700">{stats.shipped}</p>
        </div>
        <div className="rounded-xl bg-warm-white border border-beige-dark p-4">
          <p className="text-sm text-wood">Delivered</p>
          <p className="text-2xl font-bold text-green-700">{stats.delivered}</p>
        </div>
        <div className="rounded-xl bg-warm-white border border-beige-dark p-4">
          <p className="text-sm text-wood">Cancelled</p>
          <p className="text-2xl font-bold text-red-700">{stats.cancelled}</p>
        </div>
      </div>

      {/* Orders Table */}
      <div className="rounded-2xl bg-warm-white border border-beige-dark overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-beige-dark bg-beige/30">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-wood-dark">Order</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-wood-dark">Customer</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-wood-dark">Items</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-wood-dark">Total</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-wood-dark">Payment</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-wood-dark">Status</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-wood-dark">Date</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-wood-dark">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-beige-dark">
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-wood">
                    <ShoppingBag className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p>No orders yet</p>
                  </td>
                </tr>
              ) : (
                orders.map((order) => {
                  const status = statusConfig[order.status as keyof typeof statusConfig]
                  const StatusIcon = status.icon
                  const paymentStatus = paymentStatusConfig[order.payment_status as keyof typeof paymentStatusConfig]
                  
                  return (
                    <tr key={order.id} className="hover:bg-beige/20 transition-colors">
                      <td className="px-4 py-3">
                        <span className="font-medium text-wood-dark">{order.order_number}</span>
                      </td>
                      <td className="px-4 py-3">
                        <div>
                          <p className="font-medium text-wood-dark">{order.shipping_name}</p>
                          <p className="text-xs text-wood">{order.shipping_phone}</p>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-wood-dark">
                        {order.items?.length || 0} items
                      </td>
                      <td className="px-4 py-3 font-medium text-wood-dark">
                        LKR {order.total.toLocaleString()}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${paymentStatus.color}`}>
                          {paymentStatus.label}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${status.color}`}>
                          <StatusIcon className="h-3.5 w-3.5" />
                          {status.label}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-wood">
                        {formatDate(order.created_at)}
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => openOrderDetails(order)}
                          className="text-wood hover:text-wood-dark transition-colors"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Details Modal */}
      {showModal && selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-warm-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-warm-white border-b border-beige-dark px-6 py-4 flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold text-wood-dark">Order {selectedOrder.order_number}</h2>
                <p className="text-sm text-wood">Placed on {formatDate(selectedOrder.created_at)}</p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="text-wood hover:text-wood-dark transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {/* Status Section */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-wood mb-1">Order Status</p>
                  <div className="flex items-center gap-2">
                    {(() => {
                      const status = statusConfig[selectedOrder.status as keyof typeof statusConfig]
                      const StatusIcon = status.icon
                      return (
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium ${status.color}`}>
                          <StatusIcon className="h-4 w-4" />
                          {status.label}
                        </span>
                      )
                    })()}
                  </div>
                </div>
                <div>
                  <p className="text-sm text-wood mb-1">Payment Status</p>
                  <div className="flex items-center gap-2">
                    {(() => {
                      const paymentStatus = paymentStatusConfig[selectedOrder.payment_status as keyof typeof paymentStatusConfig]
                      return (
                        <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium ${paymentStatus.color}`}>
                          {paymentStatus.label}
                        </span>
                      )
                    })()}
                  </div>
                </div>
              </div>

              {/* Update Status */}
              <div className="border border-beige-dark rounded-xl p-4">
                <p className="text-sm font-semibold text-wood-dark mb-3">Update Order Status</p>
                <div className="flex flex-wrap gap-2">
                  {(Object.keys(statusConfig) as Array<keyof typeof statusConfig>).map((status) => (
                    <button
                      key={status}
                      onClick={() => updateOrderStatus(selectedOrder.id, status)}
                      disabled={updating || selectedOrder.status === status}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                        selectedOrder.status === status
                          ? 'bg-wood text-white'
                          : 'bg-beige text-wood-dark hover:bg-beige-dark'
                      } ${updating ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      {updating && selectedOrder.status !== status ? (
                        <RefreshCw className="h-4 w-4 animate-spin" />
                      ) : (
                        statusConfig[status].label
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Customer Info */}
              <div className="border border-beige-dark rounded-xl p-4">
                <p className="text-sm font-semibold text-wood-dark mb-3">Customer Information</p>
                <div className="space-y-2 text-sm">
                  <p><span className="text-wood">Name:</span> <span className="text-wood-dark">{selectedOrder.shipping_name}</span></p>
                  <p><span className="text-wood">Phone:</span> <span className="text-wood-dark">{selectedOrder.shipping_phone}</span></p>
                  <p><span className="text-wood">Address:</span> <span className="text-wood-dark">{selectedOrder.shipping_address}</span></p>
                  <p><span className="text-wood">City:</span> <span className="text-wood-dark">{selectedOrder.shipping_city}</span></p>
                  {selectedOrder.shipping_zone && (
                    <p><span className="text-wood">Zone:</span> <span className="text-wood-dark">{selectedOrder.shipping_zone}</span></p>
                  )}
                </div>
              </div>

              {/* Delivery Info */}
              {(selectedOrder.delivery_date || selectedOrder.delivery_time_slot) && (
                <div className="border border-beige-dark rounded-xl p-4">
                  <p className="text-sm font-semibold text-wood-dark mb-3">Delivery Information</p>
                  <div className="space-y-2 text-sm">
                    {selectedOrder.delivery_date && (
                      <p><span className="text-wood">Date:</span> <span className="text-wood-dark">{new Date(selectedOrder.delivery_date).toLocaleDateString()}</span></p>
                    )}
                    {selectedOrder.delivery_time_slot && (
                      <p><span className="text-wood">Time Slot:</span> <span className="text-wood-dark">{selectedOrder.delivery_time_slot}</span></p>
                    )}
                  </div>
                </div>
              )}

              {/* Order Items */}
              <div className="border border-beige-dark rounded-xl p-4">
                <p className="text-sm font-semibold text-wood-dark mb-3">Order Items</p>
                <div className="space-y-3">
                  {selectedOrder.items?.map((item) => (
                    <div key={item.id} className="flex justify-between items-center py-2 border-b border-beige-dark last:border-0">
                      <div>
                        <p className="font-medium text-wood-dark">{item.product_name}</p>
                        <p className="text-sm text-wood">Qty: {item.quantity} × LKR {item.price.toLocaleString()}</p>
                      </div>
                      <p className="font-medium text-wood-dark">LKR {item.total.toLocaleString()}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Summary */}
              <div className="border border-beige-dark rounded-xl p-4 bg-beige/30">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-wood">Subtotal</span>
                    <span className="text-wood-dark">LKR {selectedOrder.subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-wood">Shipping Fee</span>
                    <span className="text-wood-dark">LKR {selectedOrder.shipping_fee.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold pt-2 border-t border-beige-dark">
                    <span className="text-wood-dark">Total</span>
                    <span className="text-wood-dark">LKR {selectedOrder.total.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm pt-2">
                    <span className="text-wood">Payment Method</span>
                    <span className="text-wood-dark uppercase">{selectedOrder.payment_method}</span>
                  </div>
                </div>
              </div>

              {/* Notes */}
              {selectedOrder.notes && (
                <div className="border border-beige-dark rounded-xl p-4">
                  <p className="text-sm font-semibold text-wood-dark mb-2">Customer Notes</p>
                  <p className="text-sm text-wood">{selectedOrder.notes}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
