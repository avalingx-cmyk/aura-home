import { ProductGrid } from '@/components/product'
import { supabaseAdmin } from '@/lib/supabase'

async function getProducts(categorySlug?: string) {
  try {
    let query = supabaseAdmin
      .from('products')
      .select('*, category:categories(*)')
      .eq('active', true)
    
    if (categorySlug) {
      const { data: cat } = await supabaseAdmin
        .from('categories')
        .select('id')
        .eq('slug', categorySlug)
        .single()
      
      if (cat) {
        query = query.eq('category_id', cat.id)
      }
    }
    
    const { data, error } = await query
    if (error) return []
    return data || []
  } catch {
    return []
  }
}

interface ProductsPageProps {
  searchParams: { category?: string }
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const category = searchParams.category
  const products = await getProducts(category)

  return (
    <div className="min-h-screen bg-gradient-to-br from-warm-white via-beige/30 to-sage/20">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-wood-dark mb-8">
          {category ? `${category.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}` : 'All Products'}
        </h1>
        
        {products.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-wood text-lg">No products available</p>
          </div>
        ) : (
          <ProductGrid products={products} />
        )}
      </div>
    </div>
  )
}