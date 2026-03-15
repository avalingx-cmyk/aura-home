import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

// GET /api/comments - Get comments for a post
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const postId = searchParams.get('post_id')

    if (!postId) {
      return NextResponse.json({ error: 'post_id required' }, { status: 400 })
    }

    const { data: comments, error } = await supabaseAdmin
      .from('comments')
      .select(`
        *,
        author:author_id (email, raw_user_meta_data),
        replies:comments (
          id,
          content,
          guest_name,
          created_at,
          author:author_id (email, raw_user_meta_data)
        )
      `)
      .eq('post_id', postId)
      .eq('status', 'approved')
      .is('parent_id', null)
      .order('created_at', { ascending: true })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ comments: comments || [] })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// POST /api/comments - Create comment
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { post_id, content, parent_id, guest_name, guest_email } = body

    if (!post_id || !content) {
      return NextResponse.json({ 
        error: 'post_id and content required' 
      }, { status: 400 })
    }

    // Get authenticated user (if logged in)
    const { data: { user } } = await supabaseAdmin.auth.getUser()

    const { data: comment, error } = await supabaseAdmin
      .from('comments')
      .insert({
        post_id,
        author_id: user?.id || null,
        guest_name: user ? null : guest_name,
        guest_email: user ? null : guest_email,
        content,
        parent_id: parent_id || null,
        status: 'pending', // Requires approval
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ 
      success: true, 
      comment,
      message: 'Comment submitted for approval'
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
