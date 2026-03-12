import { ProductGrid } from '@/components/product'
import { products, searchProducts } from '@/lib/data/mock-data'
import { Suspense } from 'react'

interface ProductsPageProps {
  searchParams: { q?: string }
}

export default function ProductsPage({ searchParams }: ProductsPageProps) {
  const query = searchParams.q || ''
  const filteredProducts = query ? searchProducts(query) : products

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">
        {query ? `Search results for "${query}"` : 'All Products'}
      </h1>
      
      {filteredProducts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No products found for "{query}"</p>
        </div>
      ) : (
        <ProductGrid products={filteredProducts} />
      )}
    </div>
  )
}