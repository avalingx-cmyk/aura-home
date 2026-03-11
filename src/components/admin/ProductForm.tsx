'use client'

import { useForm } from 'react-hook-form'
import { Package, DollarSign, Hash, Link as LinkIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Category, Product } from '@/lib/data/mock-data'
import { cn } from '@/lib/utils'

interface ProductFormData {
  name: string
  slug: string
  description: string
  price: number
  comparePrice?: number
  stock: number
  categoryId: string
  images: string
  featured: boolean
}

interface ProductFormProps {
  product?: Product
  categories: Category[]
  onSubmit: (data: Partial<Product>) => void
  onCancel: () => void
  isSubmitting?: boolean
}

export function ProductForm({
  product,
  categories,
  onSubmit,
  onCancel,
  isSubmitting = false,
}: ProductFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ProductFormData>({
    defaultValues: {
      name: product?.name ?? '',
      slug: product?.slug ?? '',
      description: product?.description ?? '',
      price: product?.price ?? 0,
      comparePrice: product?.comparePrice ?? undefined,
      stock: product?.stock ?? 0,
      categoryId: product?.categoryId ?? '',
      images: product?.images?.join(', ') ?? '',
      featured: product?.featured ?? false,
    },
  })

  const handleFormSubmit = (data: ProductFormData) => {
    const images = data.images
      .split(',')
      .map((url) => url.trim())
      .filter(Boolean)

    onSubmit({
      ...data,
      price: Number(data.price),
      comparePrice: data.comparePrice ? Number(data.comparePrice) : undefined,
      stock: Number(data.stock),
      images,
      categoryId: data.categoryId,
    })
  }

  const nameValue = watch('name')

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      {/* Name */}
      <Input
        label="Product Name *"
        placeholder="Enter product name"
        error={errors.name?.message}
        {...register('name', { required: 'Product name is required' })}
      />

      {/* Slug */}
      <Input
        label="Slug *"
        placeholder="product-url-slug"
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
            'transition-all min-h-[120px] resize-y',
            errors.description && 'border-red-500 focus:border-red-500'
          )}
          placeholder="Describe your product..."
          {...register('description', { required: 'Description is required' })}
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-500">{errors.description.message}</p>
        )}
      </div>

      {/* Price and Compare Price */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="relative">
          <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-wood/50 mt-3" />
          <Input
            label="Price (LKR) *"
            type="number"
            placeholder="0"
            className="pl-10"
            error={errors.price?.message}
            {...register('price', {
              required: 'Price is required',
              min: { value: 0, message: 'Price must be positive' },
            })}
          />
        </div>
        <div className="relative">
          <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-wood/50 mt-3" />
          <Input
            label="Compare at Price (LKR)"
            type="number"
            placeholder="Optional"
            className="pl-10"
            {...register('comparePrice', {
              min: { value: 0, message: 'Price must be positive' },
            })}
          />
        </div>
      </div>

      {/* Stock and Category */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="relative">
          <Hash className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-wood/50 mt-3" />
          <Input
            label="Stock Quantity *"
            type="number"
            placeholder="0"
            className="pl-10"
            error={errors.stock?.message}
            {...register('stock', {
              required: 'Stock is required',
              min: { value: 0, message: 'Stock must be positive' },
            })}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-wood-dark mb-2">
            Category *
          </label>
          <select
            className={cn(
              'w-full px-4 py-3 rounded-2xl border-2 border-beige-dark',
              'bg-warm-white text-wood-dark',
              'focus:outline-none focus:border-forest focus:ring-2 focus:ring-forest/20',
              'transition-all',
              errors.categoryId && 'border-red-500 focus:border-red-500'
            )}
            {...register('categoryId', { required: 'Category is required' })}
          >
            <option value="">Select a category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
          {errors.categoryId && (
            <p className="mt-1 text-sm text-red-500">{errors.categoryId.message}</p>
          )}
        </div>
      </div>

      {/* Images */}
      <div>
        <label className="block text-sm font-medium text-wood-dark mb-2">
          Image URLs
        </label>
        <div className="relative">
          <LinkIcon className="absolute left-3 top-3 h-5 w-5 text-wood/50" />
          <textarea
            className={cn(
              'w-full px-4 py-3 pl-10 rounded-2xl border-2 border-beige-dark',
              'bg-warm-white text-wood-dark placeholder:text-wood/50',
              'focus:outline-none focus:border-forest focus:ring-2 focus:ring-forest/20',
              'transition-all min-h-[80px] resize-y'
            )}
            placeholder="Enter image URLs separated by commas..."
            {...register('images')}
          />
        </div>
        <p className="mt-1 text-sm text-wood/70">
          Enter image URLs separated by commas. Example: https://example.com/image1.jpg, https://example.com/image2.jpg
        </p>
      </div>

      {/* Featured */}
      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          id="featured"
          className={cn(
            'h-5 w-5 rounded border-2 border-beige-dark',
            'text-forest focus:ring-forest focus:ring-offset-0',
            'cursor-pointer'
          )}
          {...register('featured')}
        />
        <label htmlFor="featured" className="text-sm font-medium text-wood-dark cursor-pointer">
          Featured Product
        </label>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-beige-dark">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          <Package className="h-4 w-4 mr-2" />
          {isSubmitting ? 'Saving...' : product ? 'Update Product' : 'Create Product'}
        </Button>
      </div>
    </form>
  )
}