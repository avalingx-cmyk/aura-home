'use client'

import { Package, FolderTree, ShoppingBag, TrendingUp } from 'lucide-react'
import { useAdminStore } from '@/lib/store/admin'

const statCards = [
  { label: 'Total Products', icon: Package, color: 'bg-forest' },
  { label: 'Categories', icon: FolderTree, color: 'bg-sage' },
  { label: 'Orders', icon: ShoppingBag, color: 'bg-wood' },
  { label: 'Revenue', icon: TrendingUp, color: 'bg-green-600' },
]

export default function AdminDashboard() {
  const { products, categories } = useAdminStore()

  // Calculate mock stats
  const totalProducts = products.length
  const totalCategories = categories.length
  const mockOrders = 24 // Placeholder
  const mockRevenue = 'LKR 125,000' // Placeholder

  const stats = [totalProducts, totalCategories, mockOrders, mockRevenue]

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-wood-dark">Dashboard</h1>
        <p className="text-wood">Welcome to Aura Home admin panel</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card, index) => {
          const Icon = card.icon
          return (
            <div
              key={card.label}
              className="rounded-2xl bg-warm-white border border-beige-dark p-6 shadow-sm"
            >
              <div className="flex items-center gap-4">
                <div className={`rounded-xl p-3 ${card.color}`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-wood">{card.label}</p>
                  <p className="text-2xl font-bold text-wood-dark">{stats[index]}</p>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Products */}
        <div className="rounded-2xl bg-warm-white border border-beige-dark p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-wood-dark mb-4">Recent Products</h2>
          <div className="space-y-3">
            {products.slice(0, 5).map((product) => (
              <div
                key={product.id}
                className="flex items-center gap-3 p-3 rounded-xl bg-beige/30"
              >
                <div className="h-12 w-12 rounded-lg bg-beige-dark flex items-center justify-center overflow-hidden">
                  {product.images?.[0] ? (
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <Package className="h-6 w-6 text-wood" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-wood-dark truncate">{product.name}</p>
                  <p className="text-sm text-wood">LKR {product.price.toLocaleString()}</p>
                </div>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    product.stock > 10
                      ? 'bg-green-100 text-green-700'
                      : product.stock > 0
                      ? 'bg-yellow-100 text-yellow-700'
                      : 'bg-red-100 text-red-700'
                  }`}
                >
                  {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Categories Overview */}
        <div className="rounded-2xl bg-warm-white border border-beige-dark p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-wood-dark mb-4">Categories</h2>
          <div className="space-y-3">
            {categories.map((category) => {
              const productCount = products.filter(
                (p) => p.categoryId === category.id
              ).length
              return (
                <div
                  key={category.id}
                  className="flex items-center gap-3 p-3 rounded-xl bg-beige/30"
                >
                  <div className="h-12 w-12 rounded-lg bg-sage/30 flex items-center justify-center overflow-hidden">
                    {category.image ? (
                      <img
                        src={category.image}
                        alt={category.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <FolderTree className="h-6 w-6 text-forest" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-wood-dark truncate">{category.name}</p>
                    <p className="text-sm text-wood">{productCount} products</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="rounded-2xl bg-warm-white border border-beige-dark p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-wood-dark mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-3">
          <a
            href="/admin/products/new"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-forest text-white hover:bg-forest/90 transition-colors"
          >
            <Package className="h-4 w-4" />
            Add Product
          </a>
          <a
            href="/admin/categories/new"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-sage text-white hover:bg-sage/90 transition-colors"
          >
            <FolderTree className="h-4 w-4" />
            Add Category
          </a>
        </div>
      </div>
    </div>
  )
}