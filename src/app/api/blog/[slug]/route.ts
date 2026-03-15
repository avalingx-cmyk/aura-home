import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

// GET /api/blog/[slug] - Get single post
export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const { searchParams } = new URL(request.url)
    const incrementViews = searchParams.get('increment') === 'true'

    // Get post
    let query = supabaseAdmin
      .from('posts')
      .select(`
        *,
        authors:author_id (email, raw_user_meta_data),
        categories:post_category_map (
          category:post_categories (id, name, slug)
        ),
        tags:post_tag_map (
          tag:post_tags (id, name, slug)
        )
      `)
      .eq('slug', params.slug)

    const { data: posts, error } = await query.single()

    if (error || !posts) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }

    // Increment views if requested (for published posts)
    if (incrementViews && posts.status === 'published') {
      await supabaseAdmin
        .from('posts')
        .update({ views: (posts.views || 0) + 1 })
        .eq('id', posts.id)
    }

    return NextResponse.json({ post: posts })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// PATCH /api/blog/[slug] - Update post
export async function PATCH(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const body = await request.json()
    const {
      title,
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

    // Get current post
    const { data: currentPost } = await supabaseAdmin
      .from('posts')
      .select('id, published_at')
      .eq('slug', params.slug)
      .single()

    if (!currentPost) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }

    // Update post
    const updateData: any = {
      title,
      excerpt,
      content,
      cover_image,
      meta_title,
      meta_description,
      meta_keywords,
      updated_at: new Date().toISOString(),
    }

    if (status) {
      updateData.status = status
      if (status === 'published' && !currentPost.published_at) {
        updateData.published_at = new Date().toISOString()
      }
    }

    const { error: updateError } = await supabaseAdmin
      .from('posts')
      .update(updateData)
      .eq('id', currentPost.id)

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 })
    }

    // Update categories (remove old, add new)
    if (category_ids) {
      await supabaseAdmin
        .from('post_category_map')
        .delete()
        .eq('post_id', currentPost.id)
      
      if (category_ids.length > 0) {
        const categoryMap = category_ids.map((categoryId: string) => ({
          post_id: currentPost.id,
          category_id: categoryId,
        }))
        await supabaseAdmin.from('post_category_map').insert(categoryMap)
      }
    }

    // Update tags (remove old, add new)
    if (tag_ids) {
      await supabaseAdmin
        .from('post_tag_map')
        .delete()
        .eq('post_id', currentPost.id)
      
      if (tag_ids.length > 0) {
        const tagMap = tag_ids.map((tagId: string) => ({
          post_id: currentPost.id,
          tag_id: tagId,
        }))
        await supabaseAdmin.from('post_tag_map').insert(tagMap)
      }
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// DELETE /api/blog/[slug] - Delete post
export async function DELETE(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const { data: post } = await supabaseAdmin
      .from('posts')
      .select('id')
      .eq('slug', params.slug)
      .single()

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }

    await supabaseAdmin
      .from('posts')
      .delete()
      .eq('id', post.id)

    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
