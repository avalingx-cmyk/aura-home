'use client'

import { useForm } from 'react-hook-form'
import { FolderTree } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Category } from '@/lib/data/mock-data'
import { cn } from '@/lib/utils'

interface CategoryFormData {
  name: string
  slug: string
  description: string
  image: string
}

interface CategoryFormProps {
  category?: Category
  onSubmit: (data: Partial<Category>) => void
  onCancel: () => void
  isSubmitting?: boolean
}

export function CategoryForm({
  category,
  onSubmit,
  onCancel,
  isSubmitting = false,
}: CategoryFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CategoryFormData>({
    defaultValues: {
      name: category?.name ?? '',
      slug: category?.slug ?? '',
      description: category?.description ?? '',
      image: category?.image ?? '',
    },
  })

  const handleFormSubmit = (data: CategoryFormData) => {
    onSubmit(data)
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      {/* Name */}
      <Input
        label="Category Name *"
        placeholder="Enter category name"
        error={errors.name?.message}
        {...register('name', { required: 'Category name is required' })}
      />

      {/* Slug */}
      <Input
        label="Slug *"
        placeholder="category-url-slug"
        error={errors.slug?.message}
        {...register('slug', { required: 'Slug is required' })}
      />

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-wood-dark mb-2">
          Description *
        </label>
        <textarea
          className={cn(
            'w-full px-4 py-3 rounded-2xl border-2 border-beige-dark',
            'bg-warm-white text-wood-dark placeholder:text-wood/50',
            'focus:outline-none focus:border-forest focus:ring-2 focus:ring-forest/20',
            'transition-all min-h-[100px] resize-y',
            errors.description && 'border-red-500 focus:border-red-500'
          )}
          placeholder="Describe this category..."
          {...register('description', { required: 'Description is required' })}
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-500">{errors.description.message}</p>
        )}
      </div>

      {/* Image URL */}
      <Input
        label="Image URL"
        placeholder="https://example.com/category-image.jpg"
        {...register('image')}
      />

      {/* Actions */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-beige-dark">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          <FolderTree className="h-4 w-4 mr-2" />
          {isSubmitting ? 'Saving...' : category ? 'Update Category' : 'Create Category'}
        </Button>
      </div>
    </form>
  )
}