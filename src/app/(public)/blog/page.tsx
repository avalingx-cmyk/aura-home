'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Calendar, User, Clock, ChevronRight } from 'lucide-react'

interface Post {
  id: string
  title: string
  slug: string
  excerpt: string
  cover_image?: string
  published_at: string
  authors: { email: string }
  categories: Array<{ category: { name: string; slug: string } }>
  tags: Array<{ tag: { name: string; slug: string } }>
  views: number
}

export default function BlogPage() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch(`/api/blog?page=${page}&limit=10`)
        if (!response.ok) throw new Error('Failed to fetch posts')
        const data = await response.json()
        setPosts(data.posts)
        setTotalPages(data.pagination.totalPages)
      } catch (error) {
        console.error('Error fetching posts:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchPosts()
  }, [page])

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
        <p className="text-wood">Loading posts...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-sage-50/30">
      {/* Header */}
      <header className="bg-white border-b border-sage-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-wood-dark mb-4">
              Aura Home Blog
            </h1>
            <p className="text-lg text-wood max-w-2xl mx-auto">
              Tips, trends, and inspiration for your home
            </p>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {posts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-wood text-lg">No posts yet. Check back soon!</p>
          </div>
        ) : (
          <>
            {/* Posts Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {posts.map((post) => (
                <article
                  key={post.id}
                  className="bg-white rounded-xl shadow-sm border border-sage-100 overflow-hidden hover:shadow-md transition-shadow"
                >
                  {/* Cover Image */}
                  {post.cover_image && (
                    <Link href={`/blog/${post.slug}`} className="block aspect-video overflow-hidden">
                      <img
                        src={post.cover_image}
                        alt={post.title}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </Link>
                  )}

                  {/* Content */}
                  <div className="p-6">
                    {/* Categories */}
                    <div className="flex flex-wrap gap-2 mb-3">
                      {post.categories.slice(0, 2).map(({ category }) => (
                        <span
                          key={category.slug}
                          className="text-xs font-medium text-forest-700 bg-forest-50 px-2 py-1 rounded"
                        >
                          {category.name}
                        </span>
                      ))}
                    </div>

                    {/* Title */}
                    <Link href={`/blog/${post.slug}`}>
                      <h2 className="text-xl font-bold text-wood-dark mb-2 hover:text-forest-700 transition-colors line-clamp-2">
                        {post.title}
                      </h2>
                    </Link>

                    {/* Excerpt */}
                    <p className="text-wood mb-4 line-clamp-3">
                      {post.excerpt}
                    </p>

                    {/* Meta */}
                    <div className="flex items-center justify-between text-xs text-sage-500 mb-4">
                      <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {formatDate(post.published_at)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {post.views} views
                        </span>
                      </div>
                    </div>

                    {/* Read More */}
                    <Link
                      href={`/blog/${post.slug}`}
                      className="inline-flex items-center gap-2 text-forest-700 font-medium hover:text-forest-800 transition-colors"
                    >
                      Read More
                      <ChevronRight className="h-4 w-4" />
                    </Link>
                  </div>
                </article>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center gap-2">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-4 py-2 rounded-lg border border-sage-200 text-wood hover:bg-sage-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Previous
                </button>
                <span className="px-4 py-2 text-wood">
                  Page {page} of {totalPages}
                </span>
                <button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="px-4 py-2 rounded-lg border border-sage-200 text-wood hover:bg-sage-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  )
}
