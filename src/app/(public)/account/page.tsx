'use client'

import { useEffect, useState } from 'react'
import { ShoppingBag, Clock, Package, CheckCircle, TrendingUp } from 'lucide-react'

interface OrderStats {
  total: number
  pending: number
  processing: number
  shipped: number
  delivered: number
}

export default function AccountOverviewPage() {
  const [stats, setStats] = useState<OrderStats>({
    total: 0,
    pending: 0,
    processing: 0,
    shipped: 0,
    delivered: 0,
  })
  const [recentOrders, setRecentOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
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
        
        const orders = data.orders || []
        
        // Calculate stats
        const orderStats = orders.reduce((acc: any, order: any) => {
          acc.total++
          acc[order.status] = (acc[order.status] || 0) + 1
          return acc
        }, { total: 0, pending: 0, processing: 0, shipped: 0, delivered: 0 })
        
        setStats(orderStats)
        setRecentOrders(orders.slice(0, 5)) // Show last 5 orders
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return <div className="text-wood">Loading...</div>
  }

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <div>
        <h2 className="text-2xl font-bold text-wood-dark mb-2">Account Overview</h2>
        <p className="text-wood">Welcome to your account dashboard</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-sage-100 p-4">
          <div className="flex items-center gap-3 mb-2">
            <ShoppingBag className="h-5 w-5 text-wood" />
            <p className="text-sm text-wood">Total</p>
          </div>
          <p className="text-2xl font-bold text-wood-dark">{stats.total}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-sage-100 p-4">
          <div className="flex items-center gap-3 mb-2">
            <Clock className="h-5 w-5 text-yellow-600" />
            <p className="text-sm text-wood">Pending</p>
          </div>
          <p className="text-2xl font-bold text-yellow-700">{stats.pending}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-sage-100 p-4">
          <div className="flex items-center gap-3 mb-2">
            <Package className="h-5 w-5 text-blue-600" />
            <p className="text-sm text-wood">Processing</p>
          </div>
          <p className="text-2xl font-bold text-blue-700">{stats.processing}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-sage-100 p-4">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="h-5 w-5 text-purple-600" />
            <p className="text-sm text-wood">Shipped</p>
          </div>
          <p className="text-2xl font-bold text-purple-700">{stats.shipped}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-sage-100 p-4">
          <div className="flex items-center gap-3 mb-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <p className="text-sm text-wood">Delivered</p>
          </div>
          <p className="text-2xl font-bold text-green-700">{stats.delivered}</p>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-xl shadow-sm border border-sage-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-sage-100">
          <h3 className="font-semibold text-wood-dark">Recent Orders</h3>
        </div>
        <div className="p-6">
          {recentOrders.length === 0 ? (
            <div className="text-center py-8">
              <ShoppingBag className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p className="text-wood mb-4">No orders yet</p>
              <a
                href="/products"
                className="inline-block px-6 py-2 bg-wood text-white rounded-lg hover:bg-wood-dark transition-colors"
              >
                Browse Products
              </a>
            </div>
          ) : (
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between p-4 bg-sage-50 rounded-lg hover:bg-sage-100 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-wood/10 flex items-center justify-center">
                      <ShoppingBag className="h-5 w-5 text-wood" />
                    </div>
                    <div>
                      <p className="font-medium text-wood-dark">{order.order_number}</p>
                      <p className="text-sm text-wood">
                        {new Date(order.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <p className="font-medium text-wood-dark">
                      LKR {order.total.toLocaleString()}
                    </p>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      order.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                      order.status === 'processing' ? 'bg-blue-100 text-blue-700' :
                      order.status === 'shipped' ? 'bg-purple-100 text-purple-700' :
                      order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
