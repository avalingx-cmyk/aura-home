'use client'

import { ShoppingBag, Clock, Package, CheckCircle, XCircle } from 'lucide-react'

// Mock orders data
const mockOrders = [
  { id: 'ORD-001', customer: 'John Doe', email: 'john@example.com', total: 45000, status: 'pending', date: '2024-01-15', items: 3 },
  { id: 'ORD-002', customer: 'Jane Smith', email: 'jane@example.com', total: 125000, status: 'processing', date: '2024-01-14', items: 5 },
  { id: 'ORD-003', customer: 'Bob Johnson', email: 'bob@example.com', total: 32000, status: 'shipped', date: '2024-01-13', items: 2 },
  { id: 'ORD-004', customer: 'Alice Brown', email: 'alice@example.com', total: 78000, status: 'delivered', date: '2024-01-12', items: 4 },
  { id: 'ORD-005', customer: 'Charlie Wilson', email: 'charlie@example.com', total: 15000, status: 'cancelled', date: '2024-01-11', items: 1 },
]

const statusConfig = {
  pending: { label: 'Pending', color: 'bg-yellow-100 text-yellow-700', icon: Clock },
  processing: { label: 'Processing', color: 'bg-blue-100 text-blue-700', icon: Package },
  shipped: { label: 'Shipped', color: 'bg-purple-100 text-purple-700', icon: Package },
  delivered: { label: 'Delivered', color: 'bg-green-100 text-green-700', icon: CheckCircle },
  cancelled: { label: 'Cancelled', color: 'bg-red-100 text-red-700', icon: XCircle },
}

export default function OrdersPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-wood-dark">Orders</h1>
        <p className="text-wood">Manage customer orders</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="rounded-xl bg-warm-white border border-beige-dark p-4">
          <p className="text-sm text-wood">Pending</p>
          <p className="text-2xl font-bold text-wood-dark">3</p>
        </div>
        <div className="rounded-xl bg-warm-white border border-beige-dark p-4">
          <p className="text-sm text-wood">Processing</p>
          <p className="text-2xl font-bold text-wood-dark">5</p>
        </div>
        <div className="rounded-xl bg-warm-white border border-beige-dark p-4">
          <p className="text-sm text-wood">Shipped</p>
          <p className="text-2xl font-bold text-wood-dark">12</p>
        </div>
        <div className="rounded-xl bg-warm-white border border-beige-dark p-4">
          <p className="text-sm text-wood">Delivered</p>
          <p className="text-2xl font-bold text-wood-dark">48</p>
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
                <th className="px-4 py-3 text-left text-sm font-semibold text-wood-dark">Status</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-wood-dark">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-beige-dark">
              {mockOrders.map((order) => {
                const status = statusConfig[order.status as keyof typeof statusConfig]
                const StatusIcon = status.icon
                return (
                  <tr key={order.id} className="hover:bg-beige/20 transition-colors">
                    <td className="px-4 py-3">
                      <span className="font-medium text-wood-dark">{order.id}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div>
                        <p className="font-medium text-wood-dark">{order.customer}</p>
                        <p className="text-xs text-wood">{order.email}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-wood-dark">{order.items} items</td>
                    <td className="px-4 py-3 font-medium text-wood-dark">
                      LKR {order.total.toLocaleString()}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${status.color}`}>
                        <StatusIcon className="h-3.5 w-3.5" />
                        {status.label}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-wood">{order.date}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Notice */}
      <div className="rounded-xl bg-beige/50 border border-beige-dark p-4">
        <p className="text-sm text-wood text-center">
          📦 This is a placeholder page. Order management will be implemented with Supabase integration.
        </p>
      </div>
    </div>
  )
}