// Mock data for development

export interface Category {
  id: string
  name: string
  slug: string
  description?: string
  image?: string
}

export interface Product {
  id: string
  name: string
  slug: string
  description?: string
  price: number
  comparePrice?: number
  images: string[]
  categoryId?: string
  category?: string
  inStock?: boolean
  featured?: boolean
}

// Placeholder image for products without images
const PLACEHOLDER_IMAGE = 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&auto=format&fit=crop&q=60'

export const categories: Category[] = [
  { id: '1', name: 'Living Room', slug: 'living-room', description: 'Sofas, tables, and more for your living space' },
  { id: '2', name: 'Bedroom', slug: 'bedroom', description: 'Beds, wardrobes, and bedroom furniture' },
  { id: '3', name: 'Dining', slug: 'dining', description: 'Dining tables, chairs, and sets' },
  { id: '4', name: 'Office', slug: 'office', description: 'Desks, chairs, and office furniture' },
  { id: '5', name: 'Outdoor', slug: 'outdoor', description: 'Patio and garden furniture' }
]

export const products: Product[] = [
  { 
    id: '1', 
    name: 'Modern 3-Seater Sofa', 
    slug: 'modern-3-seater-sofa', 
    description: 'Comfortable modern sofa with premium fabric upholstery, perfect for contemporary living rooms.',
    price: 85000, 
    comparePrice: 95000, 
    images: [PLACEHOLDER_IMAGE], 
    category: 'living-room', 
    inStock: true, 
    featured: true 
  },
  { 
    id: '2', 
    name: 'King Size Bed Frame', 
    slug: 'king-size-bed-frame', 
    description: 'Elegant solid wood king size bed frame with headboard, built to last.',
    price: 120000, 
    images: [PLACEHOLDER_IMAGE], 
    category: 'bedroom', 
    inStock: true, 
    featured: true 
  },
  { 
    id: '3', 
    name: 'Dining Table Set', 
    slug: 'dining-table-set', 
    description: 'Solid wood dining table with 6 matching chairs, seats up to 8 people.',
    price: 145000, 
    images: [PLACEHOLDER_IMAGE], 
    category: 'dining', 
    inStock: true 
  },
  { 
    id: '4', 
    name: 'Executive Office Chair', 
    slug: 'executive-office-chair', 
    description: 'Ergonomic office chair with lumbar support, adjustable height, and breathable mesh back.',
    price: 35000, 
    images: [PLACEHOLDER_IMAGE], 
    category: 'office', 
    inStock: true 
  },
  { 
    id: '5', 
    name: 'Garden Lounge Set', 
    slug: 'garden-lounge-set', 
    description: 'Weather-resistant outdoor furniture set with cushions, includes 2 sofas and coffee table.',
    price: 95000, 
    images: [PLACEHOLDER_IMAGE], 
    category: 'outdoor', 
    inStock: false 
  }
]

export function getCategoryBySlug(slug: string): Category | undefined {
  return categories.find(c => c.slug === slug)
}

export function getProductsByCategory(categorySlug: string): Product[] {
  return products.filter(p => p.category === categorySlug)
}

export function getProductBySlug(slug: string): Product | undefined {
  return products.find(p => p.slug === slug)
}

export function getFeaturedProducts(): Product[] {
  return products.filter(p => p.featured)
}

// Helper to get product image with fallback
export function getProductImage(product: Product | undefined): string {
  return product?.images?.[0] || PLACEHOLDER_IMAGE
}

// Helper to search products safely
export function searchProducts(query: string): Product[] {
  const searchTerm = query.toLowerCase()
  return products.filter(p => 
    p.name.toLowerCase().includes(searchTerm) ||
    p.description?.toLowerCase().includes(searchTerm) ||
    p.category?.toLowerCase().includes(searchTerm)
  )
}