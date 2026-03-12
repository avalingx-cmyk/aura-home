import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { ProductGrid } from '@/components/product'
import { getCategoryBySlug, getProductsByCategory, categories } from '@/lib/data/mock-data'

interface CategoryPageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return categories.map((category) => ({
    slug: category.slug,
  }))
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params
  const category = getCategoryBySlug(slug)

  if (!category) {
    return {
      title: 'Category Not Found | Aura Home',
    }
  }

  return {
    title: `${category.name} | Aura Home`,
    description: category.description,
  }
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params
  const category = getCategoryBySlug(slug)

  if (!category) {
    notFound()
  }

  const products = getProductsByCategory(category.id)

  return (
    <div className="min-h-screen bg-gradient-to-br from-warm-white via-beige/30 to-sage/20">
      {/* Category Header */}
      <section className="relative h-64 lg:h-80">
        <Image
          src={category.image_url || 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1200&auto=format&fit=crop&q=60'}
          alt={category.name}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-forest/80 to-forest/40" />
        <div className="absolute inset-0 flex items-center">
          <div className="container mx-auto px-4">
            <nav className="flex items-center gap-2 text-sage/80 text-sm mb-4">
              <Link href="/" className="hover:text-white">Home</Link>
              <span>/</span>
              <Link href="/products" className="hover:text-white">Products</Link>
              <span>/</span>
              <span className="text-white">{category.name}</span>
            </nav>
            <h1 className="text-3xl lg:text-5xl font-bold text-white mb-2">{category.name}</h1>
            <p className="text-sage/90 text-lg max-w-2xl">{category.description}</p>
          </div>
        </div>
      </section>

      {/* Products */}
      <section className="container mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-8">
          <p className="text-wood">
            <span className="font-medium text-wood-dark">{products.length}</span> products in {category.name}
          </p>
        </div>

        <ProductGrid
          products={products}
          emptyMessage={`No products found in ${category.name}`}
        />
      </section>

      {/* Other Categories */}
      <section className="container mx-auto px-4 pb-16">
        <h2 className="text-2xl font-semibold text-wood-dark mb-6">Explore Other Categories</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories
            .filter((c) => c.id !== category.id)
            .map((cat) => (
              <Link
                key={cat.id}
                href={`/categories/${cat.slug}`}
                className="group"
              >
                <div className="relative h-32 rounded-2xl overflow-hidden">
                  <Image
                    src={cat.image_url || 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1200&auto=format&fit=crop&q=60'}
                    alt={cat.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-forest/40 group-hover:bg-forest/30 transition-colors" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-white font-medium text-center">{cat.name}</span>
                  </div>
                </div>
              </Link>
            ))}
        </div>
      </section>
    </div>
  )
}