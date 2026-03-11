'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { DataTable, Column } from '@/components/admin/DataTable'
import { useAdminStore } from '@/lib/store/admin'
import { Product } from '@/lib/data/mock-data'
import { toast } from '@/lib/store/toast'
import { cn } from '@/lib/utils'

export default function ProductsPage() {
  const router = useRouter()
  const { products, categories, deleteProduct } = useAdminStore()
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')

  // Filter products
  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = !categoryFilter || product.categoryId === categoryFilter
    return matchesSearch && matchesCategory
  })

  const handleEdit = (product: Product) => {
    router.push(`/admin/products/${product.id}/edit`)
  }

  const handleDelete = (product: Product) => {
    if (window.confirm(`Are you sure you want to delete "${product.name}"?`)) {
      deleteProduct(product.id)
      toast.success('Product deleted successfully')
    }
  }

  const columns: Column<Product>[] = [
    {
      key: 'name',
      header: 'Product',
      sortable: true,
      render: (product) => (
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-beige-dark flex items-center justify-center overflow-hidden">
            {product.images?.[0] ? (
              <img
                src={product.images[0]}
                alt={product.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <span className="text-wood text-xs">No img</span>
            )}
          </div>
          <div>
            <p className="font-medium text-wood-dark">{product.name}</p>
            <p className="text-xs text-wood">{product.slug}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'categoryId',
      header: 'Category',
      sortable: true,
      render: (product) => {
        const category = categories.find((c) => c.id === product.categoryId)
        return category ? (
          <span className="px-2 py-1 rounded-full text-xs bg-sage/20 text-forest">
            {category.name}
          </span>
        ) : (
          <span className="text-wood/50">Uncategorized</span>
        )
      },
    },
    {
      key: 'price',
      header: 'Price',
      sortable: true,
      render: (product) => (
        <div>
          <p className="font-medium text-wood-dark">LKR {product.price.toLocaleString()}</p>
          {product.comparePrice && (
            <p className="text-xs text-wood line-through">
              LKR {product.comparePrice.toLocaleString()}
            </p>
          )}
        </div>
      ),
    },
    {
      key: 'stock',
      header: 'Stock',
      sortable: true,
      render: (product) => (
        <span
          className={cn(
            'px-2 py-1 rounded-full text-xs font-medium',
            product.stock > 10
              ? 'bg-green-100 text-green-700'
              : product.stock > 0
              ? 'bg-yellow-100 text-yellow-700'
              : 'bg-red-100 text-red-700'
          )}
        >
          {product.stock}
        </span>
      ),
    },
    {
      key: 'featured',
      header: 'Featured',
      render: (product) =>
        product.featured ? (
          <span className="px-2 py-1 rounded-full text-xs bg-forest/20 text-forest">
            Featured
          </span>
        ) : (
          <span className="text-wood/50">—</span>
        ),
    },
  ]

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-wood-dark">Products</h1>
          <p className="text-wood">Manage your product catalog</p>
        </div>
        <Button onClick={() => router.push('/admin/products/new')}>
          <Plus className="h-4 w-4 mr-2" />
          Add Product
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-wood/50" />
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={cn(
              'w-full pl-10 pr-4 py-2.5 rounded-xl border-2 border-beige-dark',
              'bg-warm-white text-wood-dark placeholder:text-wood/50',
              'focus:outline-none focus:border-forest focus:ring-2 focus:ring-forest/20',
              'transition-all'
            )}
          />
        </div>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className={cn(
            'px-4 py-2.5 rounded-xl border-2 border-beige-dark',
            'bg-warm-white text-wood-dark',
            'focus:outline-none focus:border-forest focus:ring-2 focus:ring-forest/20',
            'transition-all'
          )}
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      {/* Products Table */}
      <DataTable
        data={filteredProducts}
        columns={columns}
        keyField="id"
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  )
}