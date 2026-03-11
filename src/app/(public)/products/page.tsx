'use client'

import { useState, useMemo } from 'react'
import { Search } from 'lucide-react'
import { ProductGrid, ProductFilters, type FilterState } from '@/components/product'
import { products, categories } from '@/lib/data/mock-data'

const defaultFilters: FilterState = {
  category: null,
  priceRange: [0, 500000],
  inStock: false,
  onSale: false,
  sortBy: 'newest',
}

export default function ProductsPage() {
  const [filters, setFilters] = useState<FilterState>(defaultFilters)
  const [searchQuery, setSearchQuery] = useState('')

  const filteredProducts = useMemo(() => {
    let result = [...products]

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query)
      )
    }

    // Category filter
    if (filters.category) {
      result = result.filter((p) => p.category_id === filters.category)
    }

    // Price filter
    result = result.filter(
      (p) => {
        const price = p.sale_price || p.price
        return price >= filters.priceRange[0] && price <= filters.priceRange[1]
      }
    )

    // In stock filter
    if (filters.inStock) {
      result = result.filter((p) => p.stock > 0)
    }

    // On sale filter
    if (filters.onSale) {
      result = result.filter((p) => p.sale_price && p.sale_price < p.price)
    }

    // Sort
    switch (filters.sortBy) {
      case 'price-asc':
        result.sort((a, b) => (a.sale_price || a.price) - (b.sale_price || b.price))
        break
      case 'price-desc':
        result.sort((a, b) => (b.sale_price || b.price) - (a.sale_price || a.price))
        break
      case 'rating':
        result.sort((a, b) => b.rating - a.rating)
        break
      case 'name':
        result.sort((a, b) => a.name.localeCompare(b.name))
        break
      case 'newest':
      default:
        // Keep original order (sorted by id for mock data)
        break
    }

    return result
  }, [filters, searchQuery])

  return (
    <div className="min-h-screen bg-gradient-to-br from-warm-white via-beige/30 to-sage/20">
      {/* Header */}
      <section className="bg-forest text-white py-12 lg:py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl lg:text-4xl font-bold mb-4">Our Products</h1>
          <p className="text-sage/80 text-lg max-w-2xl">
            Discover our curated collection of premium furniture, crafted with care for Sri Lankan homes.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="container mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* Desktop Filters Sidebar */}
          <div className="hidden lg:block">
            <ProductFilters filters={filters} onFilterChange={setFilters} />
          </div>

          {/* Products Grid */}
          <div className="flex-1 space-y-6">
            {/* Search and Mobile Controls */}
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-wood/50" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-warm-white rounded-2xl shadow-soft border-none focus:outline-none focus:ring-2 focus:ring-forest text-wood-dark placeholder:text-wood/50"
                />
              </div>

              {/* Mobile Filter Controls */}
              <div className="flex lg:hidden gap-2">
                <ProductFilters filters={filters} onFilterChange={setFilters} />
              </div>
            </div>

            {/* Results Count */}
            <div className="flex items-center justify-between">
              <p className="text-wood">
                Showing <span className="font-medium text-wood-dark">{filteredProducts.length}</span> products
              </p>
              <div className="hidden lg:flex items-center gap-2">
                <span className="text-wood text-sm">Sort by:</span>
                <select
                  value={filters.sortBy}
                  onChange={(e) => setFilters({ ...filters, sortBy: e.target.value as FilterState['sortBy'] })}
                  className="px-3 py-1.5 bg-warm-white rounded-lg text-wood-dark text-sm border-none focus:outline-none focus:ring-2 focus:ring-forest"
                >
                  <option value="newest">Newest First</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                  <option value="name">Name A-Z</option>
                </select>
              </div>
            </div>

            {/* Products */}
            <ProductGrid
              products={filteredProducts}
              emptyMessage={searchQuery ? `No products found for "${searchQuery}"` : 'No products match your filters'}
            />
          </div>
        </div>
      </section>
    </div>
  )
}