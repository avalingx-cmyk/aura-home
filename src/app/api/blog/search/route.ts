import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

// GET /api/blog/search - Search posts
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q') || ''
    const category = searchParams.get('category')
    const tag = searchParams.get('tag')

    if (!query && !category && !tag) {
      return NextResponse.json({ posts: [], total: 0 })
    }

    let dbQuery = supabaseAdmin
      .from('posts')
      .select(`
        *,
        authors:author_id (email),
        categories:post_category_map (
          category:post_categories (id, name, slug)
        ),
        tags:post_tag_map (
          tag:post_tags (id, name, slug)
        )
      `, { count: 'exact' })
      .eq('status', 'published')

    // Search in title, excerpt, and content
    if (query) {
      dbQuery = dbQuery.or(`title.ilike.%${query}%,excerpt.ilike.%${query}%,content.ilike.%${query}%`)
    }

    // Filter by category
    if (category) {
      dbQuery = dbQuery.contains('post_category_map', [{ category: { slug: category } }])
    }

    // Filter by tag
    if (tag) {
      dbQuery = dbQuery.contains('post_tag_map', [{ tag: { slug: tag } }])
    }

    const { data: posts, error, count } = await dbQuery
      .order('published_at', { ascending: false })
      .limit(20)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({
      posts: posts || [],
      total: count || 0,
      query,
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
