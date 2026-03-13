'use client'

import Image from 'next/image'
import { useState } from 'react'

const PLACEHOLDER_IMAGE = 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&auto=format&fit=crop&q=60'

export interface ProductDetailProps {
  product: {
    id: string
    name: string
    slug: string
    description?: string
    price: number
    comparePrice?: number
    images: string[]
    category?: string
    inStock?: boolean
  }
  onAddToCart?: () => void
}

export function ProductDetail({ product, onAddToCart }: ProductDetailProps) {
  const [selectedImage, setSelectedImage] = useState(0)
  
  const imageUrl = product.images?.[selectedImage] || PLACEHOLDER_IMAGE
  const hasDiscount = product.comparePrice && product.comparePrice > product.price
  const discountPercent = hasDiscount
    ? Math.round(((product.comparePrice! - product.price) / product.comparePrice!) * 100)
    : 0

  return (
    <div className="grid md:grid-cols-2 gap-8">
      {/* Image Section */}
      <div className="space-y-4">
        <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden">
          <Image
            src={imageUrl}
            alt={product.name}
            fill
            className="object-cover"
            priority
          />
          {hasDiscount && (
            <span className="absolute top-4 left-4 bg-red-500 text-white text-sm px-3 py-1 rounded">
              -{discountPercent}% OFF
            </span>
          )}
        </div>
        
        {/* Thumbnail Gallery */}
        {product.images && product.images.length > 1 && (
          <div className="flex gap-2 overflow-x-auto">
            {product.images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedImage(idx)}
                className={`relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden border-2 ${
                  selectedImage === idx ? 'border-green-500' : 'border-gray-200'
                }`}
              >
                <Image
                  src={img || PLACEHOLDER_IMAGE}
                  alt={`${product.name} ${idx + 1}`}
                  fill
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Details Section */}
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
        
        <div className="flex items-center gap-3">
          <span className="text-3xl font-bold text-gray-900">
            Rs. {product.price.toLocaleString()}
          </span>
          {hasDiscount && (
            <span className="text-xl text-gray-400 line-through">
              Rs. {product.comparePrice!.toLocaleString()}
            </span>
          )}
        </div>

        {product.description && (
          <p className="text-gray-600 leading-relaxed">{product.description}</p>
        )}

        <div className="flex items-center gap-2">
          {product.inStock !== false ? (
            <span className="text-green-600 font-medium">In Stock</span>
          ) : (
            <span className="text-red-600 font-medium">Out of Stock</span>
          )}
        </div>

        <button
          onClick={onAddToCart}
          disabled={product.inStock === false}
          className={`w-full py-3 px-6 rounded-lg font-medium transition-colors ${
            product.inStock === false
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-green-600 text-white hover:bg-green-700'
          }`}
        >
          {product.inStock === false ? 'Out of Stock' : 'Add to Cart'}
        </button>
      </div>
    </div>
  )
}