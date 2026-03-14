'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ShoppingBag, Clock, Package, CheckCircle, XCircle, TrendingUp, ExternalLink } from 'lucide-react'

interface Order {
  id: string
  order_number: string
  status: string
  total: number
  items_count: number
  created_at: string
  payment_status: string
  payment_method: string
}

const statusConfig = {
  pending: { label: 'Pending', color: 'bg-yellow-100 text-yellow-700', icon: Clock },
  processing: { label: 'Processing', color: 'bg-blue-100 text-blue-700', icon: Package },
  shipped: { label: 'Shipped', color: 'bg-purple-100 text-purple-700', icon: TrendingUp },
  delivered: { label: 'Delivered', color: 'bg-green-100 text-green-700', icon: CheckCircle },
  cancelled: { label: 'Cancelled', color: 'bg-red-100 text-red-700', icon: XCircle },
}

export default function AccountOrdersPage() {
  const router = useRouter()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<string>('all')

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        // Get current user
        const { getCurrentUser } = await import('@/lib/auth')
        const user = await getCurrentUser()
        
        if (!user?.email) {
          setLoading(false)
          return
        }

        // Fetch orders filtered by customer email
        const response = await fetch(`/api/orders?customer_email=${encodeURIComponent(user.email)}`)
        if (!response.ok) throw new Error('Failed to fetch orders')
        const data = await response.json()
        setOrders(data.orders || [])
      } catch (error) {
        console.error('Error fetching orders:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [])

  const filteredOrders = filter === 'all' 
    ? orders 
    : orders.filter(order => order.status === filter)

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-wood-dark mb-2">Order History</h2>
        <p className="text-wood">View and track all your orders</p>
      </div>

      {/* Filter */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {['all', 'pending', 'processing', 'shipped', 'delivered', 'cancelled'].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
              filter === status
                ? 'bg-wood text-white'
                : 'bg-white text-wood hover:bg-beige/50'
            }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
            {status !== 'all' && (
              <span className="ml-2 text-xs opacity-75">
                ({orders.filter(o => o.status === status).length})
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Orders List */}
      {loading ? (
        <div className="text-center py-12">
          <p className="text-wood">Loading your orders...</p>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-sage-100 p-12 text-center">
          <ShoppingBag className="h-16 w-16 mx-auto mb-4 opacity-20" />
          <h3 className="text-lg font-semibold text-wood-dark mb-2">No orders found</h3>
          <p className="text-wood mb-6">
            {filter === 'all' 
              ? "You haven't placed any orders yet"
              : `No ${filter} orders`}
          </p>
          {filter === 'all' && (
            <a
              href="/products"
              className="inline-block px-6 py-3 bg-wood text-white rounded-lg hover:bg-wood-dark transition-colors"
            >
              Start Shopping
            </a>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => {
            const status = statusConfig[order.status as keyof typeof statusConfig]
            const StatusIcon = status.icon
            
            return (
              <div
                key={order.id}
                className="bg-white rounded-xl shadow-sm border border-sage-100 p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  {/* Order Info */}
                  <div className="flex items-start gap-4">
                    <div className="h-12 w-12 rounded-full bg-wood/10 flex items-center justify-center flex-shrink-0">
                      <ShoppingBag className="h-6 w-6 text-wood" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-wood-dark mb-1">
                        {order.order_number}
                      </h3>
                      <p className="text-sm text-wood">
                        {formatDate(order.created_at)}
                      </p>
                      <div className="flex items-center gap-3 mt-2 text-sm">
                        <span className="text-wood">
                          {order.items_count || 0} items
                        </span>
                        <span className="text-beige-dark">•</span>
                        <span className="text-wood uppercase">
                          {order.payment_method || 'COD'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Status & Total */}
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <p className="text-sm text-wood mb-1">Total</p>
                      <p className="text-xl font-bold text-wood-dark">
                        LKR {order.total.toLocaleString()}
                      </p>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium ${status.color}`}>
                        <StatusIcon className="h-4 w-4" />
                        {status.label}
                      </span>
                      
                      <button
                        onClick={() => router.push(`/account/orders/${order.id}`)}
                        className="p-2 text-wood hover:text-wood-dark transition-colors"
                        title="View details"
                      >
                        <ExternalLink className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
