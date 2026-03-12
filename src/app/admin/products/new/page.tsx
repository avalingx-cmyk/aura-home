'use client'

import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ProductForm } from '@/components/admin/ProductForm'
import { useAdminStore } from '@/lib/store/admin'
import { Product } from '@/lib/data/mock-data'
import { toast } from '@/lib/store/toast'
import { useState } from 'react'

export default function NewProductPage() {
  const router = useRouter()
  const { products, categories, addProduct } = useAdminStore()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (data: Partial<Product>) => {
    setIsSubmitting(true)
    try {
      // Generate a unique ID
      const maxId = Math.max(...products.map((p) => parseInt(p.id) || 0), 0)
      const newProduct: Product = {
        id: String(maxId + 1),
        name: data.name || '',
        slug: data.slug || '',
        description: data.description || '',
        price: data.price || 0,
        comparePrice: data.comparePrice,
        inStock: true,
        categoryId: data.categoryId || '',
        images: data.images || [],
        featured: data.featured || false,
      }

      addProduct(newProduct)
      toast.success('Product created successfully')
      router.push('/admin/products')
    } catch (error) {
      toast.error('Failed to create product')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="secondary"
          onClick={() => router.back()}
          className="p-2"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-wood-dark">Add New Product</h1>
          <p className="text-wood">Create a new product for your catalog</p>
        </div>
      </div>

      {/* Form Card */}
      <div className="rounded-2xl bg-warm-white border border-beige-dark p-6 shadow-sm">
        <ProductForm
          categories={categories}
          onSubmit={handleSubmit}
          onCancel={() => router.push('/admin/products')}
          isSubmitting={isSubmitting}
        />
      </div>
    </div>
  )
}