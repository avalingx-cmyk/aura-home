import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// GET /api/products - List products
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const categorySlug = searchParams.get('category')
  const featured = searchParams.get('featured')
  const slug = searchParams.get('slug')
  const limit = parseInt(searchParams.get('limit') || '50')
  const offset = parseInt(searchParams.get('offset') || '0')

  // Get single product by slug
  if (slug) {
    const { data, error } = await supabase
      .from('products')
      .select('*, category:categories(*)')
      .eq('slug', slug)
      .eq('active', true)
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 404 })
    }

    return NextResponse.json({ product: data })
  }

  // Build query for list
  let query = supabase
    .from('products')
    .select('*, category:categories(*)', { count: 'exact' })
    .eq('active', true)
    .order('sort_order')
    .range(offset, offset + limit - 1)

  // Filter by category slug
  if (categorySlug) {
    const { data: cat } = await supabase
      .from('categories')
      .select('id')
      .eq('slug', categorySlug)
      .single()
    
    if (cat) {
      query = query.eq('category_id', cat.id)
    }
  }

  // Filter featured
  if (featured === 'true') {
    query = query.eq('featured', true)
  }

  const { data, error, count } = await query

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ products: data, total: count })
}