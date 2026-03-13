'use client'

import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ProductForm } from '@/components/admin/ProductForm'
import { useAdminStore } from '@/lib/store/admin'
import { toast } from '@/lib/store/toast'
import { useState, useEffect } from 'react'

export default function NewProductPage() {
  const router = useRouter()
  const { categories, addProduct, fetchCategories } = useAdminStore()
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    fetchCategories()
  }, [fetchCategories])

  const handleSubmit = async (data: any) => {
    setIsSubmitting(true)
    try {
      const product = await addProduct({
        name: data.name,
        slug: data.slug,
        description: data.description,
        price: data.price,
        compare_price: data.comparePrice,
        stock_quantity: data.stock,
        category_id: data.categoryId,
        images: data.images,
        featured: data.featured,
        active: true,
      })

      if (product) {
        toast.success('Product created successfully')
        router.push('/admin/products')
      } else {
        toast.error('Failed to create product')
      }
    } catch (error) {
      toast.error('Failed to create product')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
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

      <div className="rounded-2xl bg-warm-white border border-beige-dark p-6 shadow-sm">
        <ProductForm
          categories={categories.map(c => ({ id: c.id, name: c.name }))}
          onSubmit={handleSubmit}
          onCancel={() => router.push('/admin/products')}
          isSubmitting={isSubmitting}
        />
      </div>
    </div>
  )
}