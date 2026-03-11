// Mock data for development
// TODO: Replace with Supabase queries when database is connected

export interface Category {
  id: string
  name: string
  slug: string
  description: string
  image_url: string
}

export interface Product {
  id: string
  name: string
  slug: string
  description: string
  price: number
  sale_price?: number
  stock: number
  category_id: string
  images: string[]
  featured: boolean
  rating: number
  review_count: number
}

export const categories: Category[] = [
  {
    id: 'cat-1',
    name: 'Living Room',
    slug: 'living-room',
    description: 'Comfortable and stylish furniture for your living space',
    image_url: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80',
  },
  {
    id: 'cat-2',
    name: 'Bedroom',
    slug: 'bedroom',
    description: 'Create your perfect sanctuary for rest and relaxation',
    image_url: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800&q=80',
  },
  {
    id: 'cat-3',
    name: 'Dining Room',
    slug: 'dining-room',
    description: 'Gather around with family and friends in style',
    image_url: 'https://images.unsplash.com/photo-1617806118233-18e1de247200?w=800&q=80',
  },
  {
    id: 'cat-4',
    name: 'Office',
    slug: 'office',
    description: 'Productive and ergonomic workspace solutions',
    image_url: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=800&q=80',
  },
  {
    id: 'cat-5',
    name: 'Outdoor',
    slug: 'outdoor',
    description: 'Transform your outdoor spaces into comfortable retreats',
    image_url: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800&q=80',
  },
  {
    id: 'cat-6',
    name: 'Storage',
    slug: 'storage',
    description: 'Smart storage solutions for an organized home',
    image_url: 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=800&q=80',
  },
]

export const products: Product[] = [
  // Living Room
  {
    id: 'prod-1',
    name: 'Colombo Comfort Sofa',
    slug: 'colombo-comfort-sofa',
    description: 'A beautifully crafted 3-seater sofa with premium fabric upholstery. Perfect for Sri Lankan homes, this sofa combines modern design with exceptional comfort. Features high-density foam cushions and a solid wood frame.',
    price: 145000,
    sale_price: 125000,
    stock: 15,
    category_id: 'cat-1',
    images: [
      'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80',
      'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=800&q=80',
      'https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=800&q=80',
    ],
    featured: true,
    rating: 4.8,
    review_count: 124,
  },
  {
    id: 'prod-2',
    name: 'Kandy Teak Coffee Table',
    slug: 'kandy-teak-coffee-table',
    description: 'Handcrafted from sustainable Sri Lankan teak, this coffee table showcases the natural beauty of local craftsmanship. The warm wood tones complement any living room decor.',
    price: 45000,
    stock: 22,
    category_id: 'cat-1',
    images: [
      'https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?w=800&q=80',
      'https://images.unsplash.com/photo-1532372320572-cda25653a26d?w=800&q=80',
    ],
    featured: true,
    rating: 4.9,
    review_count: 89,
  },
  {
    id: 'prod-3',
    name: 'Galle Accent Chair',
    slug: 'galle-accent-chair',
    description: 'A stunning accent chair inspired by Dutch colonial architecture. Features rattan details and plush cushions, perfect for creating a cozy reading nook.',
    price: 52000,
    stock: 18,
    category_id: 'cat-1',
    images: [
      'https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=800&q=80',
    ],
    featured: false,
    rating: 4.6,
    review_count: 67,
  },
  {
    id: 'prod-4',
    name: 'Negombo TV Console',
    slug: 'negombo-tv-console',
    description: 'Modern TV console with cable management and ample storage. Made from engineered wood with a walnut finish that complements contemporary interiors.',
    price: 68000,
    stock: 12,
    category_id: 'cat-1',
    images: [
      'https://images.unsplash.com/photo-1615874959474-d609969a20ed?w=800&q=80',
    ],
    featured: false,
    rating: 4.5,
    review_count: 43,
  },

  // Bedroom
  {
    id: 'prod-5',
    name: 'Sigiriya King Bed Frame',
    slug: 'sigiriya-king-bed-frame',
    description: 'Majestic king-size bed frame inspired by the grandeur of Sigiriya. Crafted from solid teak with intricate headboard details. Mattress not included.',
    price: 185000,
    sale_price: 165000,
    stock: 8,
    category_id: 'cat-2',
    images: [
      'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800&q=80',
      'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800&q=80',
    ],
    featured: true,
    rating: 4.9,
    review_count: 156,
  },
  {
    id: 'prod-6',
    name: 'Ella Bedside Table Set',
    slug: 'ella-bedside-table-set',
    description: 'Set of two matching bedside tables with soft-close drawers. Made from rubber wood with a natural finish, perfect for flanking your bed.',
    price: 35000,
    stock: 25,
    category_id: 'cat-2',
    images: [
      'https://images.unsplash.com/photo-1499933374294-4584851497cc?w=800&q=80',
    ],
    featured: false,
    rating: 4.7,
    review_count: 78,
  },
  {
    id: 'prod-7',
    name: 'Nuwara Wardrobe',
    slug: 'nuwara-wardrobe',
    description: 'Spacious 3-door wardrobe with mirror panels and internal organizers. Perfect for storing your entire wardrobe collection.',
    price: 95000,
    stock: 10,
    category_id: 'cat-2',
    images: [
      'https://images.unsplash.com/photo-1558997519-83ea9252edf8?w=800&q=80',
    ],
    featured: false,
    rating: 4.6,
    review_count: 52,
  },

  // Dining Room
  {
    id: 'prod-8',
    name: 'Mahogany Dining Set',
    slug: 'mahogany-dining-set',
    description: 'Elegant 6-seater dining set crafted from Sri Lankan mahogany. Includes extendable table and 6 comfortable chairs with cushioned seats.',
    price: 225000,
    stock: 5,
    category_id: 'cat-3',
    images: [
      'https://images.unsplash.com/photo-1617806118233-18e1de247200?w=800&q=80',
      'https://images.unsplash.com/photo-1617806118233-18e1de247200?w=800&q=80',
    ],
    featured: true,
    rating: 4.8,
    review_count: 91,
  },
  {
    id: 'prod-9',
    name: 'Colombo Sideboard',
    slug: 'colombo-sideboard',
    description: 'Modern sideboard with sliding doors and adjustable shelves. Perfect for storing dinnerware and displaying decorative items.',
    price: 78000,
    stock: 14,
    category_id: 'cat-3',
    images: [
      'https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=800&q=80',
    ],
    featured: false,
    rating: 4.5,
    review_count: 34,
  },

  // Office
  {
    id: 'prod-10',
    name: 'Remote Work Desk',
    slug: 'remote-work-desk',
    description: 'Spacious work desk with built-in cable management and keyboard tray. Perfect for work-from-home setups. Adjustable height available.',
    price: 55000,
    stock: 20,
    category_id: 'cat-4',
    images: [
      'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=800&q=80',
    ],
    featured: false,
    rating: 4.7,
    review_count: 112,
  },
  {
    id: 'prod-11',
    name: 'Ergonomic Office Chair',
    slug: 'ergonomic-office-chair',
    description: 'Premium ergonomic chair with lumbar support, adjustable armrests, and breathable mesh back. Perfect for long work sessions.',
    price: 42000,
    sale_price: 38000,
    stock: 30,
    category_id: 'cat-4',
    images: [
      'https://images.unsplash.com/photo-1580480055273-228ff5388ef8?w=800&q=80',
    ],
    featured: true,
    rating: 4.6,
    review_count: 203,
  },
  {
    id: 'prod-12',
    name: 'Bookshelf Unit',
    slug: 'bookshelf-unit',
    description: '5-tier open bookshelf with industrial design. Perfect for books, plants, and decorative displays. Easy assembly required.',
    price: 32000,
    stock: 35,
    category_id: 'cat-4',
    images: [
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80',
    ],
    featured: false,
    rating: 4.4,
    review_count: 67,
  },

  // Outdoor
  {
    id: 'prod-13',
    name: 'Patio Lounge Set',
    slug: 'patio-lounge-set',
    description: 'Weather-resistant outdoor lounge set with 2-seater sofa and two armchairs. Includes cushions with removable covers.',
    price: 165000,
    stock: 7,
    category_id: 'cat-5',
    images: [
      'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800&q=80',
    ],
    featured: false,
    rating: 4.5,
    review_count: 28,
  },
  {
    id: 'prod-14',
    name: 'Garden Swing Chair',
    slug: 'garden-swing-chair',
    description: 'Relaxing swing chair with canopy shade and sturdy steel frame. Perfect for gardens and verandas.',
    price: 48000,
    stock: 12,
    category_id: 'cat-5',
    images: [
      'https://images.unsplash.com/photo-1598880940080-ff9a29891b85?w=800&q=80',
    ],
    featured: false,
    rating: 4.3,
    review_count: 45,
  },

  // Storage
  {
    id: 'prod-15',
    name: 'Modular Storage System',
    slug: 'modular-storage-system',
    description: 'Customizable storage cubes that can be arranged to fit any space. Set of 6 cubes in natural wood finish.',
    price: 28000,
    stock: 40,
    category_id: 'cat-6',
    images: [
      'https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=800&q=80',
    ],
    featured: false,
    rating: 4.2,
    review_count: 89,
  },
  {
    id: 'prod-16',
    name: 'Shoe Cabinet',
    slug: 'shoe-cabinet',
    description: 'Slim shoe cabinet with tilt-out drawers. Holds up to 16 pairs of shoes. Perfect for entryways.',
    price: 25000,
    stock: 22,
    category_id: 'cat-6',
    images: [
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
    ],
    featured: false,
    rating: 4.4,
    review_count: 56,
  },
]

// Helper functions
export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug)
}

export function getProductsByCategory(categoryId: string): Product[] {
  return products.filter((p) => p.category_id === categoryId)
}

export function getFeaturedProducts(): Product[] {
  return products.filter((p) => p.featured)
}

export function getCategoryBySlug(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug)
}

export function getRelatedProducts(productId: string, limit = 4): Product[] {
  const product = products.find((p) => p.id === productId)
  if (!product) return []
  
  return products
    .filter((p) => p.category_id === product.category_id && p.id !== productId)
    .slice(0, limit)
}