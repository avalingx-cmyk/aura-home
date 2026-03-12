// Mock data for development
// TODO: Replace with Supabase queries

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
  {
    id: '1',
    name: 'Living Room',
    slug: 'living-room',
    description: 'Sofas, tables, and more for your living space',
    image: '/images/categories/living-room.jpg'
  },
  {
    id: '2',
    name: 'Bedroom',
    slug: 'bedroom',
    description: 'Beds, wardrobes, and bedroom furniture',
    image: '/images/categories/bedroom.jpg'
  },
  {
    id: '3',
    name: 'Dining',
    slug: 'dining',
    description: 'Dining tables, chairs, and sets',
    image: '/images/categories/dining.jpg'
  },
  {
    id: '4',
    name: 'Office',
    slug: 'office',
    description: 'Desks, chairs, and office furniture',
    image: '/images/categories/office.jpg'
  },
  {
    id: '5',
    name: 'Outdoor',
    slug: 'outdoor',
    description: 'Patio and garden furniture',
    image: '/images/categories/outdoor.jpg'
  }
]

export const products: Product[] = [
  {
    id: '1',
    name: 'Modern 3-Seater Sofa',
    slug: 'modern-3-seater-sofa',
    description: 'Comfortable modern sofa with premium fabric',
    price: 85000,
    comparePrice: 95000,
    images: ['/images/products/sofa-1.jpg'],
    categoryId: '1',
    category: 'living-room',
    inStock: true,
    featured: true
  },
  {
    id: '2',
    name: 'King Size Bed Frame',
    slug: 'king-size-bed-frame',
    description: 'Elegant wooden king size bed frame',
    price: 120000,
    images: ['/images/products/bed-1.jpg'],
    categoryId: '2',
    category: 'bedroom',
    inStock: true,
    featured: true
  },
  {
    id: '3',
    name: 'Dining Table Set 6 Seater',
    slug: 'dining-table-set-6-seater',
    description: 'Solid wood dining table with 6 chairs',
    price: 145000,
    comparePrice: 160000,
    images: ['/images/products/dining-1.jpg'],
    categoryId: '3',
    category: 'dining',
    inStock: true
  },
  {
    id: '4',
    name: 'Executive Office Chair',
    slug: 'executive-office-chair',
    description: 'Ergonomic office chair with lumbar support',
    price: 35000,
    images: ['/images/products/chair-1.jpg'],
    categoryId: '4',
    category: 'office',
    inStock: true
  },
  {
    id: '5',
    name: 'Garden Lounge Set',
    slug: 'garden-lounge-set',
    description: 'Weather-resistant outdoor furniture set',
    price: 95000,
    images: ['/images/products/outdoor-1.jpg'],
    categoryId: '5',
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