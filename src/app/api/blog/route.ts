import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

// GET /api/blog - List published posts or all posts for admin
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status') || 'published'
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const category = searchParams.get('category')
    const tag = searchParams.get('tag')

    let query = supabaseAdmin
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
      `)

    // Filter by status
    if (status === 'all') {
      // Admin view - show all
    } else {
      query = query.eq('status', 'published')
    }

    // Filter by category
    if (category) {
      query = query.contains('post_category_map', [{ category: { slug: category } }])
    }

    // Filter by tag
    if (tag) {
      query = query.contains('post_tag_map', [{ tag: { slug: tag } }])
    }

    const offset = (page - 1) * limit

    const { data: posts, error } = await query
      .order('published_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Get total count
    const { count } = await supabaseAdmin
      .from('posts')
      .select('*', { count: 'exact', head: true })
      .eq('status', status === 'all' ? 'published' : status)

    return NextResponse.json({
      posts: posts || [],
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit),
      },
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// POST /api/blog - Create new post
export async function POST(request: Request) {
  try {
    const supabase = supabaseAdmin
    const body = await request.json()
    const {
      title,
      slug,
      excerpt,
      content,
      cover_image,
      category_ids,
      tag_ids,
      meta_title,
      meta_description,
      meta_keywords,
      status,
    } = body

    // Get authenticated user
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Create post
    const { data: post, error: postError } = await supabase
      .from('posts')
      .insert({
        title,
        slug,
        excerpt,
        content,
        cover_image,
        author_id: user.id,
        meta_title,
        meta_description,
        meta_keywords,
        status: status || 'draft',
        published_at: status === 'published' ? new Date().toISOString() : null,
      })
      .select()
      .single()

    if (postError) {
      return NextResponse.json({ error: postError.message }, { status: 500 })
    }

    // Add categories
    if (category_ids && category_ids.length > 0) {
      const categoryMap = category_ids.map((categoryId: string) => ({
        post_id: post.id,
        category_id: categoryId,
      }))
      await supabase.from('post_category_map').insert(categoryMap)
    }

    // Add tags
    if (tag_ids && tag_ids.length > 0) {
      const tagMap = tag_ids.map((tagId: string) => ({
        post_id: post.id,
        tag_id: tagId,
      }))
      await supabase.from('post_tag_map').insert(tagMap)
    }

    return NextResponse.json({ success: true, post })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
