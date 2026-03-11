'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, FolderTree } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { DataTable, Column } from '@/components/admin/DataTable'
import { useAdminStore } from '@/lib/store/admin'
import { Category } from '@/lib/data/mock-data'
import { toast } from '@/lib/store/toast'

export default function CategoriesPage() {
  const router = useRouter()
  const { categories, products, deleteCategory } = useAdminStore()

  const handleEdit = (category: Category) => {
    router.push(`/admin/categories/${category.id}/edit`)
  }

  const handleDelete = (category: Category) => {
    const productCount = products.filter((p) => p.categoryId === category.id).length
    if (productCount > 0) {
      toast.error(`Cannot delete category with ${productCount} products. Move or delete products first.`)
      return
    }
    if (window.confirm(`Are you sure you want to delete "${category.name}"?`)) {
      deleteCategory(category.id)
      toast.success('Category deleted successfully')
    }
  }

  const columns: Column<Category>[] = [
    {
      key: 'name',
      header: 'Category',
      sortable: true,
      render: (category) => (
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-sage/30 flex items-center justify-center overflow-hidden">
            {category.image ? (
              <img
                src={category.image}
                alt={category.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <FolderTree className="h-5 w-5 text-forest" />
            )}
          </div>
          <div>
            <p className="font-medium text-wood-dark">{category.name}</p>
            <p className="text-xs text-wood">{category.slug}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'description',
      header: 'Description',
      render: (category) => (
        <p className="text-sm text-wood line-clamp-2 max-w-md">
          {category.description}
        </p>
      ),
    },
    {
      key: 'id',
      header: 'Products',
      render: (category) => {
        const count = products.filter((p) => p.categoryId === category.id).length
        return (
          <span className="px-2 py-1 rounded-full text-xs bg-beige text-wood-dark">
            {count} {count === 1 ? 'product' : 'products'}
          </span>
        )
      },
    },
  ]

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-wood-dark">Categories</h1>
          <p className="text-wood">Organize your product categories</p>
        </div>
        <Button onClick={() => router.push('/admin/categories/new')}>
          <Plus className="h-4 w-4 mr-2" />
          Add Category
        </Button>
      </div>

      {/* Categories Table */}
      <DataTable
        data={categories}
        columns={columns}
        keyField="id"
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  )
}