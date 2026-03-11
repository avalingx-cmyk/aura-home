'use client'

import { ProductCard } from './product-card'
import type { Product } from '@/lib/data/mock-data'

interface ProductGridProps {
  products: Product[]
  emptyMessage?: string
}

export function ProductGrid({ products, emptyMessage = 'No products found' }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-20 h-20 bg-beige rounded-full flex items-center justify-center mb-4">
          <svg
            className="w-10 h-10 text-wood"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
            />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-wood-dark mb-1">{emptyMessage}</h3>
        <p className="text-wood text-sm">Try adjusting your filters or browse all products</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          id={product.id}
          name={product.name}
          slug={product.slug}
          price={product.price}
          comparePrice={product.sale_price}
          image={product.images[0] || '/placeholder-product.jpg'}
          rating={product.rating}
          reviewCount={product.review_count}
          inStock={product.stock > 0}
        />
      ))}
    </div>
  )
}