import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// GET /api/products - List products
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const categorySlug = searchParams.get('category')
  const featured = searchParams.get('featured')
  const slug = searchParams.get('slug')
  const id = searchParams.get('id')
  const limit = parseInt(searchParams.get('limit') || '50')
  const offset = parseInt(searchParams.get('offset') || '0')

  // Get single product by ID
  if (id) {
    const { data, error } = await supabase
      .from('products')
      .select('*, category:categories(*)')
      .eq('id', id)
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 404 })
    }

    return NextResponse.json({ product: data })
  }

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

// POST /api/products - Create product
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { 
      name, 
      slug, 
      description, 
      price, 
      compare_price, 
      sku,
      stock_quantity,
      category_id,
      images,
      featured,
      active 
    } = body

    if (!name || !slug || price === undefined) {
      return NextResponse.json({ error: 'Name, slug, and price are required' }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('products')
      .insert({
        name,
        slug,
        description: description || null,
        price,
        compare_price: compare_price || null,
        sku: sku || null,
        stock_quantity: stock_quantity || 0,
        category_id: category_id || null,
        images: images || [],
        featured: featured || false,
        active: active !== false,
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ product: data })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// PATCH /api/products - Update product
export async function PATCH(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 })
    }

    const body = await request.json()
    const { 
      name, 
      slug, 
      description, 
      price, 
      compare_price, 
      sku,
      stock_quantity,
      category_id,
      images,
      featured,
      active 
    } = body

    const updateData: Record<string, any> = {}
    if (name !== undefined) updateData.name = name
    if (slug !== undefined) updateData.slug = slug
    if (description !== undefined) updateData.description = description
    if (price !== undefined) updateData.price = price
    if (compare_price !== undefined) updateData.compare_price = compare_price
    if (sku !== undefined) updateData.sku = sku
    if (stock_quantity !== undefined) updateData.stock_quantity = stock_quantity
    if (category_id !== undefined) updateData.category_id = category_id
    if (images !== undefined) updateData.images = images
    if (featured !== undefined) updateData.featured = featured
    if (active !== undefined) updateData.active = active

    const { data, error } = await supabase
      .from('products')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ product: data })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// DELETE /api/products - Delete product
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 })
    }

    // Soft delete by setting active to false
    const { error } = await supabase
      .from('products')
      .update({ active: false })
      .eq('id', id)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}