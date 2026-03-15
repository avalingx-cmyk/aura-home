'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { Calendar, User, Clock, Tag, Share2, MessageSquare } from 'lucide-react'
import Head from 'next/head'

interface Post {
  id: string
  title: string
  slug: string
  content: string
  excerpt?: string
  cover_image?: string
  published_at: string
  meta_title?: string
  meta_description?: string
  meta_keywords?: string
  authors: { email: string }
  categories: Array<{ category: { name: string; slug: string } }>
  tags: Array<{ tag: { name: string; slug: string } }>
  views: number
}

interface Comment {
  id: string
  content: string
  guest_name?: string
  created_at: string
  author?: { email: string }
  replies: Comment[]
}

export default function BlogPostPage() {
  const params = useParams()
  const [post, setPost] = useState<Post | null>(null)
  const [loading, setLoading] = useState(true)
  const [comments, setComments] = useState<Comment[]>([])
  const [commentContent, setCommentContent] = useState('')

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await fetch(`/api/comments?post_id=${params.slug}`)
        if (response.ok) {
          const data = await response.json()
          setComments(data.comments)
        }
      } catch (error) {
        console.error('Error fetching comments:', error)
      }
    }

    const fetchPost = async () => {
      try {
        const response = await fetch(`/api/blog/${params.slug}?increment=true`)
        if (!response.ok) throw new Error('Post not found')
        const data = await response.json()
        setPost(data.post)
      } catch (error) {
        console.error('Error fetching post:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchPost()
    fetchComments()
  }, [params.slug])

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!params?.slug || !post?.id) return
    
    try {
      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          post_id: post.id,
          content: commentContent,
        }),
      })

      if (response.ok) {
        setCommentContent('')
        // Refetch comments
        const response = await fetch(`/api/comments?post_id=${params.slug}`)
        if (response.ok) {
          const data = await response.json()
          setComments(data.comments)
        }
        alert('Comment submitted for approval!')
      }
    } catch (error) {
      console.error('Error submitting comment:', error)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-wood">Loading post...</p>
      </div>
    )
  }

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-wood">Post not found</p>
      </div>
    )
  }

  return (
    <>
      {/* SEO */}
      <Head>
        <title>{post.meta_title || post.title}</title>
        <meta name="description" content={post.meta_description || post.excerpt} />
        <meta name="keywords" content={post.meta_keywords || ''} />
        <meta property="og:title" content={post.meta_title || post.title} />
        <meta property="og:description" content={post.meta_description || post.excerpt} />
        <meta property="og:type" content="article" />
        <meta property="article:published_time" content={post.published_at} />
        {post.cover_image && <meta property="og:image" content={post.cover_image} />}
        <meta name="twitter:card" content="summary_large_image" />
      </Head>

      <article className="min-h-screen bg-white">
        {/* Header */}
        <header className="bg-sage-50/30 border-b border-sage-100">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            {/* Categories */}
            <div className="flex flex-wrap gap-2 mb-4">
              {post.categories.map(({ category }) => (
                <span
                  key={category.slug}
                  className="text-sm font-medium text-forest-700 bg-forest-50 px-3 py-1 rounded-full"
                >
                  {category.name}
                </span>
              ))}
            </div>

            {/* Title */}
            <h1 className="text-4xl font-bold text-wood-dark mb-6">
              {post.title}
            </h1>

            {/* Meta */}
            <div className="flex flex-wrap items-center gap-6 text-sm text-sage-500">
              <span className="flex items-center gap-2">
                <User className="h-4 w-4" />
                {post.authors?.email || 'Anonymous'}
              </span>
              <span className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                {formatDate(post.published_at)}
              </span>
              <span className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                {post.views} views
              </span>
            </div>
          </div>
        </header>

        {/* Cover Image */}
        {post.cover_image && (
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
            <img
              src={post.cover_image}
              alt={post.title}
              className="w-full h-96 object-cover rounded-xl shadow-lg"
            />
          </div>
        )}

        {/* Content */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Excerpt */}
          {post.excerpt && (
            <p className="text-xl text-wood mb-8 leading-relaxed">
              {post.excerpt}
            </p>
          )}

          {/* Content */}
          <div
            className="prose prose-forest max-w-none mb-12"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-8 pt-8 border-t border-sage-100">
            <Tag className="h-5 w-5 text-sage-500" />
            {post.tags.map(({ tag }) => (
              <span
                key={tag.slug}
                className="text-sm text-wood bg-sage-50 px-3 py-1 rounded-full"
              >
                {tag.name}
              </span>
            ))}
          </div>

          {/* Share */}
          <div className="flex items-center gap-4 pt-8 border-t border-sage-100">
            <Share2 className="h-5 w-5 text-sage-500" />
            <span className="text-sm text-wood">Share this post</span>
            <button className="text-sm text-forest-700 hover:text-forest-800">
              Twitter
            </button>
            <button className="text-sm text-forest-700 hover:text-forest-800">
              LinkedIn
            </button>
            <button className="text-sm text-forest-700 hover:text-forest-800">
              Facebook
            </button>
          </div>
        </div>

        {/* Comments Section */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-t border-sage-100">
          <div className="flex items-center gap-3 mb-8">
            <MessageSquare className="h-6 w-6 text-wood" />
            <h2 className="text-2xl font-bold text-wood-dark">
              Comments ({comments.length})
            </h2>
          </div>

          {/* Comment Form */}
          <form onSubmit={handleSubmitComment} className="mb-8">
            <textarea
              value={commentContent}
              onChange={(e) => setCommentContent(e.target.value)}
              placeholder="Write a comment..."
              rows={4}
              required
              className="w-full px-4 py-3 border border-beige-dark rounded-lg focus:ring-2 focus:ring-wood focus:border-transparent resize-none"
            />
            <div className="mt-3 flex justify-end">
              <button
                type="submit"
                className="px-6 py-2 bg-wood text-white rounded-lg hover:bg-wood-dark transition-colors"
              >
                Post Comment
              </button>
            </div>
          </form>

          {/* Comments List */}
          {comments.length === 0 ? (
            <p className="text-center text-wood py-8">
              No comments yet. Be the first to comment!
            </p>
          ) : (
            <div className="space-y-6">
              {comments.map((comment) => (
                <div
                  key={comment.id}
                  className="bg-sage-50 rounded-lg p-6"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="h-10 w-10 rounded-full bg-wood/10 flex items-center justify-center">
                      <User className="h-5 w-5 text-wood" />
                    </div>
                    <div>
                      <p className="font-medium text-wood-dark">
                        {comment.guest_name || comment.author?.email || 'Anonymous'}
                      </p>
                      <p className="text-xs text-sage-500">
                        {formatDate(comment.created_at)}
                      </p>
                    </div>
                  </div>
                  <p className="text-wood">{comment.content}</p>
                </div>
              ))}
            </div>
          )}
        </section>
      </article>
    </>
  )
}
