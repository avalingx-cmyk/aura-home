'use client'

import { useState, useEffect } from 'react'
import { Filter, X, ChevronDown, SlidersHorizontal } from 'lucide-react'
import { categories, type Category } from '@/lib/data/mock-data'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export interface FilterState {
  category: string | null
  priceRange: [number, number]
  inStock: boolean
  onSale: boolean
  sortBy: SortOption
}

export type SortOption = 'newest' | 'price-asc' | 'price-desc' | 'rating' | 'name'

interface ProductFiltersProps {
  filters: FilterState
  onFilterChange: (filters: FilterState) => void
  maxPrice?: number
}

const sortOptions: { value: SortOption; label: string }[] = [
  { value: 'newest', label: 'Newest First' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Highest Rated' },
  { value: 'name', label: 'Name A-Z' },
]

const priceRanges = [
  { label: 'All Prices', min: 0, max: 500000 },
  { label: 'Under Rs. 25,000', min: 0, max: 25000 },
  { label: 'Rs. 25,000 - Rs. 50,000', min: 25000, max: 50000 },
  { label: 'Rs. 50,000 - Rs. 100,000', min: 50000, max: 100000 },
  { label: 'Rs. 100,000 - Rs. 200,000', min: 100000, max: 200000 },
  { label: 'Above Rs. 200,000', min: 200000, max: 500000 },
]

export function ProductFilters({ filters, onFilterChange, maxPrice = 500000 }: ProductFiltersProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const handleCategoryChange = (categoryId: string | null) => {
    onFilterChange({ ...filters, category: categoryId })
  }

  const handlePriceChange = (min: number, max: number) => {
    onFilterChange({ ...filters, priceRange: [min, max] })
  }

  const handleSortChange = (sortBy: SortOption) => {
    onFilterChange({ ...filters, sortBy })
  }

  const handleInStockChange = () => {
    onFilterChange({ ...filters, inStock: !filters.inStock })
  }

  const handleOnSaleChange = () => {
    onFilterChange({ ...filters, onSale: !filters.onSale })
  }

  const clearFilters = () => {
    onFilterChange({
      category: null,
      priceRange: [0, maxPrice],
      inStock: false,
      onSale: false,
      sortBy: 'newest',
    })
  }

  const activeFilterCount = [
    filters.category,
    filters.priceRange[0] > 0 || filters.priceRange[1] < maxPrice,
    filters.inStock,
    filters.onSale,
  ].filter(Boolean).length

  const FilterContent = () => (
    <div className="space-y-6">
      {/* Categories */}
      <div>
        <h3 className="font-medium text-wood-dark mb-3">Categories</h3>
        <div className="space-y-2">
          <button
            onClick={() => handleCategoryChange(null)}
            className={cn(
              'block w-full text-left px-3 py-2 rounded-xl text-sm transition-colors',
              !filters.category
                ? 'bg-forest text-white'
                : 'text-wood hover:bg-beige'
            )}
          >
            All Categories
          </button>
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => handleCategoryChange(category.id)}
              className={cn(
                'block w-full text-left px-3 py-2 rounded-xl text-sm transition-colors',
                filters.category === category.id
                  ? 'bg-forest text-white'
                  : 'text-wood hover:bg-beige'
              )}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h3 className="font-medium text-wood-dark mb-3">Price Range</h3>
        <div className="space-y-2">
          {priceRanges.map((range) => (
            <button
              key={range.label}
              onClick={() => handlePriceChange(range.min, range.max)}
              className={cn(
                'block w-full text-left px-3 py-2 rounded-xl text-sm transition-colors',
                filters.priceRange[0] === range.min && filters.priceRange[1] === range.max
                  ? 'bg-forest text-white'
                  : 'text-wood hover:bg-beige'
              )}
            >
              {range.label}
            </button>
          ))}
        </div>
      </div>

      {/* Quick Filters */}
      <div>
        <h3 className="font-medium text-wood-dark mb-3">Quick Filters</h3>
        <div className="space-y-2">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={filters.inStock}
              onChange={handleInStockChange}
              className="w-4 h-4 rounded border-wood text-forest focus:ring-forest"
            />
            <span className="text-sm text-wood">In Stock Only</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={filters.onSale}
              onChange={handleOnSaleChange}
              className="w-4 h-4 rounded border-wood text-forest focus:ring-forest"
            />
            <span className="text-sm text-wood">On Sale</span>
          </label>
        </div>
      </div>

      {/* Clear Filters */}
      {activeFilterCount > 0 && (
        <Button variant="secondary" onClick={clearFilters} className="w-full">
          Clear All Filters
        </Button>
      )}
    </div>
  )

  // Desktop sidebar
  if (!isMobile) {
    return (
      <aside className="w-64 flex-shrink-0">
        <div className="sticky top-24 bg-warm-white rounded-3xl p-6 shadow-soft">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-wood-dark flex items-center gap-2">
              <Filter className="w-5 h-5" />
              Filters
            </h2>
            {activeFilterCount > 0 && (
              <span className="bg-forest text-white text-xs px-2 py-1 rounded-full">
                {activeFilterCount}
              </span>
            )}
          </div>
          <FilterContent />
        </div>
      </aside>
    )
  }

  // Mobile filter drawer
  return (
    <>
      {/* Mobile filter button */}
      <button
        onClick={() => setIsOpen(true)}
        className="lg:hidden flex items-center gap-2 px-4 py-2 bg-warm-white rounded-xl shadow-soft text-wood-dark"
      >
        <SlidersHorizontal className="w-4 h-4" />
        Filters
        {activeFilterCount > 0 && (
          <span className="bg-forest text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
            {activeFilterCount}
          </span>
        )}
      </button>

      {/* Sort dropdown (mobile) */}
      <div className="lg:hidden flex items-center gap-2">
        <select
          value={filters.sortBy}
          onChange={(e) => handleSortChange(e.target.value as SortOption)}
          className="flex-1 px-4 py-2 bg-warm-white rounded-xl shadow-soft text-wood-dark text-sm appearance-none"
        >
          {sortOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Mobile filter drawer */}
      {isOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/40 z-50"
            onClick={() => setIsOpen(false)}
          />
          <div className="fixed bottom-0 left-0 right-0 bg-warm-white z-50 rounded-t-3xl max-h-[85vh] overflow-y-auto">
            <div className="sticky top-0 bg-warm-white p-4 border-b border-beige flex items-center justify-between">
              <h2 className="text-lg font-semibold text-wood-dark">Filters</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-beige rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4">
              <FilterContent />
            </div>
            <div className="sticky bottom-0 bg-warm-white p-4 border-t border-beige">
              <Button onClick={() => setIsOpen(false)} className="w-full">
                Apply Filters
              </Button>
            </div>
          </div>
        </>
      )}
    </>
  )
}