import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight, Truck, Shield, RefreshCw } from 'lucide-react'
import { ProductCard } from '@/components/product/product-card'
import { supabaseAdmin } from '@/lib/supabase'

export const dynamic = 'force-dynamic'
export const revalidate = 0

async function getCategories() {
  try {
    const { data, error } = await supabaseAdmin
      .from('categories')
      .select('*')
    if (error) return []
    return data || []
  } catch {
    return []
  }
}

async function getFeaturedProducts() {
  try {
    const { data, error } = await supabaseAdmin
      .from('products')
      .select('*, category:categories(*)')
      .eq('active', true)
      .eq('featured', true)
      .limit(4)
    if (error) return []
    return data || []
  } catch {
    return []
  }
}

export default async function HomePage() {
  const [categories, featuredProducts] = await Promise.all([
    getCategories(),
    getFeaturedProducts()
  ])

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="relative h-[60vh] bg-gradient-to-br from-sage/20 to-beige flex items-center">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-6xl font-bold text-wood-dark mb-4">
              Transform Your Space Into a <span className="text-forest">Haven</span>
            </h1>
            <p className="text-lg text-wood mb-8">
              Premium furniture crafted for comfort and style. Quality pieces delivered to your doorstep.
            </p>
            <div className="flex gap-4">
              <Link href="/products"><Button size="lg">Shop Now <ArrowRight className="ml-2 w-5 h-5" /></Button></Link>
              <Link href="/about"><Button variant="secondary" size="lg">Learn More</Button></Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-12 bg-warm-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Truck, title: 'Free Delivery', desc: 'On orders above Rs. 15,000' },
              { icon: Shield, title: '2 Year Warranty', desc: 'Quality guaranteed' },
              { icon: RefreshCw, title: 'Easy Returns', desc: '7-day return policy' },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-forest/10 flex items-center justify-center">
                  <Icon className="w-6 h-6 text-forest" />
                </div>
                <div>
                  <h3 className="font-semibold text-wood-dark">{title}</h3>
                  <p className="text-sm text-wood">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-wood-dark mb-8">Shop by Category</h2>
          {categories.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {categories.slice(0, 4).map((cat: any) => (
                <Link key={cat.id} href={`/products?category=${cat.slug}`} className="group relative aspect-square rounded-3xl overflow-hidden">
                  <img 
                    src={cat.image_url || 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=300'} 
                    alt={cat.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <h3 className="absolute bottom-4 left-4 text-white font-semibold text-lg">{cat.name}</h3>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-wood">No categories available</p>
          )}
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-beige/30">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-wood-dark">Featured Products</h2>
            <Link href="/products"><Button variant="ghost">View All <ArrowRight className="ml-2 w-4 h-4" /></Button></Link>
          </div>
          {featuredProducts.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {featuredProducts.map((product: any) => (
                <ProductCard 
                  key={product.id} 
                  id={product.id}
                  name={product.name}
                  slug={product.slug}
                  price={product.price}
                  comparePrice={product.compare_price}
                  image={product.images?.[0] || 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400'}
                />
              ))}
            </div>
          ) : (
            <p className="text-wood">No featured products available</p>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-forest text-white text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Transform Your Home?</h2>
          <p className="text-sage mb-8">Visit our stores in Vavuniya or shop online. We deliver across Sri Lanka.</p>
          <Link href="/contact"><Button size="lg" className="bg-white text-forest hover:bg-beige">Contact Us</Button></Link>
        </div>
      </section>
    </div>
  )
}