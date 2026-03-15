import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'

// GET /api/wishlist - Get current user's wishlist
export async function GET() {
  try {
    const supabase = createServerClient()
    
    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ 
        wishlist: [],
        message: 'Not authenticated' 
      })
    }

    // Get wishlist items with product details
    const { data: wishlist, error } = await supabase
      .from('wishlists')
      .select(`
        *,
        products (
          id,
          name,
          slug,
          price,
          compare_price,
          images,
          active
        )
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ wishlist: wishlist || [] })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// POST /api/wishlist - Add item to wishlist
export async function POST(request: Request) {
  try {
    const supabase = createServerClient()
    
    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { product_id } = body

    if (!product_id) {
      return NextResponse.json({ error: 'product_id required' }, { status: 400 })
    }

    // Check if product exists
    const { data: product } = await supabase
      .from('products')
      .select('id')
      .eq('id', product_id)
      .single()

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    // Add to wishlist (upsert to handle duplicates)
    const { data: wishlist, error } = await supabase
      .from('wishlists')
      .upsert({
        user_id: user.id,
        product_id,
      }, {
        onConflict: 'user_id,product_id',
      })
      .select(`
        *,
        products (
          id,
          name,
          slug,
          price,
          compare_price,
          images,
          active
        )
      `)
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ 
      success: true, 
      wishlist,
      message: 'Added to wishlist'
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// DELETE /api/wishlist - Remove item from wishlist
export async function DELETE(request: Request) {
  try {
    const supabase = createServerClient()
    
    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const product_id = searchParams.get('product_id')

    if (!product_id) {
      return NextResponse.json({ error: 'product_id required' }, { status: 400 })
    }

    const { error } = await supabase
      .from('wishlists')
      .delete()
      .eq('user_id', user.id)
      .eq('product_id', product_id)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ 
      success: true,
      message: 'Removed from wishlist'
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// PATCH /api/wishlist - Toggle wishlist item
export async function PATCH(request: Request) {
  try {
    const supabase = createServerClient()
    
    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { product_id } = body

    if (!product_id) {
      return NextResponse.json({ error: 'product_id required' }, { status: 400 })
    }

    // Check if already in wishlist
    const { data: existing } = await supabase
      .from('wishlists')
      .select('id')
      .eq('user_id', user.id)
      .eq('product_id', product_id)
      .single()

    if (existing) {
      // Remove from wishlist
      await supabase
        .from('wishlists')
        .delete()
        .eq('user_id', user.id)
        .eq('product_id', product_id)

      return NextResponse.json({ 
        success: true,
        in_wishlist: false,
        message: 'Removed from wishlist'
      })
    } else {
      // Add to wishlist
      const { data: wishlist, error } = await supabase
        .from('wishlists')
        .insert({
          user_id: user.id,
          product_id,
        })
        .select(`
          *,
          products (
            id,
            name,
            slug,
            price,
            compare_price,
            images,
            active
          )
        `)
        .single()

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
      }

      return NextResponse.json({ 
        success: true,
        in_wishlist: true,
        wishlist,
        message: 'Added to wishlist'
      })
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
