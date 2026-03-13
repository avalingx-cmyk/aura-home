'use client'

import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { CategoryForm } from '@/components/admin/CategoryForm'
import { useAdminStore } from '@/lib/store/admin'
import { toast } from '@/lib/store/toast'
import { useState } from 'react'

export default function NewCategoryPage() {
  const router = useRouter()
  const { addCategory } = useAdminStore()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (data: any) => {
    setIsSubmitting(true)
    try {
      const category = await addCategory({
        name: data.name,
        slug: data.slug,
        description: data.description,
        image_url: data.image_url,
      })

      if (category) {
        toast.success('Category created successfully')
        router.push('/admin/categories')
      } else {
        toast.error('Failed to create category')
      }
    } catch (error) {
      toast.error('Failed to create category')
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
          <h1 className="text-2xl font-bold text-wood-dark">Add New Category</h1>
          <p className="text-wood">Create a new product category</p>
        </div>
      </div>

      <div className="rounded-2xl bg-warm-white border border-beige-dark p-6 shadow-sm">
        <CategoryForm
          onSubmit={handleSubmit}
          onCancel={() => router.push('/admin/categories')}
          isSubmitting={isSubmitting}
        />
      </div>
    </div>
  )
}