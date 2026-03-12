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

export const categories: Category[] = [
  { id: '1', name: 'Living Room', slug: 'living-room', description: 'Sofas, tables, and more' },
  { id: '2', name: 'Bedroom', slug: 'bedroom', description: 'Beds, wardrobes, and bedroom furniture' },
  { id: '3', name: 'Dining', slug: 'dining', description: 'Dining tables, chairs, and sets' },
  { id: '4', name: 'Office', slug: 'office', description: 'Desks, chairs, and office furniture' },
  { id: '5', name: 'Outdoor', slug: 'outdoor', description: 'Patio and garden furniture' }
]

export const products: Product[] = [
  { id: '1', name: 'Modern 3-Seater Sofa', slug: 'modern-3-seater-sofa', price: 85000, comparePrice: 95000, images: [], category: 'living-room', inStock: true, featured: true },
  { id: '2', name: 'King Size Bed Frame', slug: 'king-size-bed-frame', price: 120000, images: [], category: 'bedroom', inStock: true, featured: true },
  { id: '3', name: 'Dining Table Set', slug: 'dining-table-set', price: 145000, images: [], category: 'dining', inStock: true },
  { id: '4', name: 'Executive Office Chair', slug: 'executive-office-chair', price: 35000, images: [], category: 'office', inStock: true },
  { id: '5', name: 'Garden Lounge Set', slug: 'garden-lounge-set', price: 95000, images: [], category: 'outdoor', inStock: false }
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