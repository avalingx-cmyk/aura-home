'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { ArrowLeft, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ProductForm } from '@/components/admin/ProductForm'
import { useAdminStore } from '@/lib/store/admin'
import { Product } from '@/lib/data/mock-data'
import { toast } from '@/lib/store/toast'

export default function EditProductPage() {
  const router = useRouter()
  const params = useParams()
  const productId = params.id as string
  const { products, categories, updateProduct } = useAdminStore()
  const [product, setProduct] = useState<Product | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const foundProduct = products.find((p) => p.id === productId)
    if (foundProduct) {
      setProduct(foundProduct)
    } else {
      toast.error('Product not found')
      router.push('/admin/products')
    }
    setLoading(false)
  }, [productId, products, router])

  const handleSubmit = async (data: Partial<Product>) => {
    setIsSubmitting(true)
    try {
      updateProduct(productId, data)
      toast.success('Product updated successfully')
      router.push('/admin/products')
    } catch (error) {
      toast.error('Failed to update product')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-forest" />
      </div>
    )
  }

  if (!product) {
    return null
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
          <h1 className="text-2xl font-bold text-wood-dark">Edit Product</h1>
          <p className="text-wood">Update product details</p>
        </div>
      </div>

      {/* Form Card */}
      <div className="rounded-2xl bg-warm-white border border-beige-dark p-6 shadow-sm">
        <ProductForm
          product={product}
          categories={categories}
          onSubmit={handleSubmit}
          onCancel={() => router.push('/admin/products')}
          isSubmitting={isSubmitting}
        />
      </div>
    </div>
  )
}