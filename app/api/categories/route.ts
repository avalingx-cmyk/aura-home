import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// GET /api/categories - List categories
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const slug = searchParams.get('slug')

  // Get single category by slug
  if (slug) {
    const { data, error } = await supabase
      .from('categories')
      .select('*, products:products(count)')
      .eq('slug', slug)
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 404 })
    }

    return NextResponse.json({ category: data })
  }

  // List all categories
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('sort_order')

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ categories: data })
}