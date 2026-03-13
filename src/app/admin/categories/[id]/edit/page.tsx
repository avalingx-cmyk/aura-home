'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { ArrowLeft, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { CategoryForm } from '@/components/admin/CategoryForm'
import { useAdminStore, Category } from '@/lib/store/admin'
import { toast } from '@/lib/store/toast'

export default function EditCategoryPage() {
  const router = useRouter()
  const params = useParams()
  const categoryId = params.id as string
  const { categories, fetchCategories, updateCategory } = useAdminStore()
  const [category, setCategory] = useState<Category | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCategories()
  }, [fetchCategories])

  useEffect(() => {
    if (categories.length > 0) {
      const foundCategory = categories.find((c) => c.id === categoryId)
      if (foundCategory) {
        setCategory(foundCategory)
      } else {
        toast.error('Category not found')
        router.push('/admin/categories')
      }
      setLoading(false)
    }
  }, [categoryId, categories, router])

  const handleSubmit = async (data: any) => {
    setIsSubmitting(true)
    try {
      const success = await updateCategory(categoryId, {
        name: data.name,
        slug: data.slug,
        description: data.description,
        image_url: data.image_url,
      })

      if (success) {
        toast.success('Category updated successfully')
        router.push('/admin/categories')
      } else {
        toast.error('Failed to update category')
      }
    } catch (error) {
      toast.error('Failed to update category')
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

  if (!category) {
    return null
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
          <h1 className="text-2xl font-bold text-wood-dark">Edit Category</h1>
          <p className="text-wood">Update category details</p>
        </div>
      </div>

      <div className="rounded-2xl bg-warm-white border border-beige-dark p-6 shadow-sm">
        <CategoryForm
          category={category}
          onSubmit={handleSubmit}
          onCancel={() => router.push('/admin/categories')}
          isSubmitting={isSubmitting}
        />
      </div>
    </div>
  )
}