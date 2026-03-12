import { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { categories } from '@/lib/data/mock-data'

export const metadata: Metadata = {
  title: 'Categories | Aura Home',
  description: 'Browse our furniture categories - Living Room, Bedroom, Dining, Office, and more.',
}

export default function CategoriesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-warm-white via-beige/30 to-sage/20">
      {/* Header */}
      <section className="bg-forest text-white py-12 lg:py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl lg:text-4xl font-bold mb-4">Shop by Category</h1>
          <p className="text-sage/80 text-lg max-w-2xl">
            Find the perfect furniture for every room in your home.
          </p>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/categories/${category.slug}`}
              className="group relative overflow-hidden rounded-3xl bg-warm-white shadow-soft hover:shadow-lg transition-shadow"
            >
              <div className="relative h-64">
                <Image
                  src={category.image_url || 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1200&auto=format&fit=crop&q=60'}
                  alt={category.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-forest/80 via-forest/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h2 className="text-2xl font-bold text-white mb-2">{category.name}</h2>
                  <p className="text-sage/90 text-sm line-clamp-2">{category.description}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}