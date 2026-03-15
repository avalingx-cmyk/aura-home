'use client'

import { Suspense, useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Search, Calendar, Clock, ChevronRight } from 'lucide-react'

interface Post {
  id: string
  title: string
  slug: string
  excerpt?: string
  cover_image?: string
  published_at: string
  authors: { email: string }
  categories: Array<{ category: { name: string; slug: string } }>
  tags: Array<{ tag: { name: string; slug: string } }>
  views: number
}

function BlogSearchContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [total, setTotal] = useState(0)

  useEffect(() => {
    if (!searchParams) return
    
    const searchQuery = searchParams.get('q') || ''
    setQuery(searchQuery)

    if (searchQuery) {
      const fetchSearch = async () => {
        try {
          const response = await fetch(`/api/blog/search?q=${encodeURIComponent(searchQuery)}`)
          if (!response.ok) throw new Error('Search failed')
          const data = await response.json()
          setPosts(data.posts)
          setTotal(data.total)
        } catch (error) {
          console.error('Error searching:', error)
        } finally {
          setLoading(false)
        }
      }

      fetchSearch()
    } else {
      setLoading(false)
    }
  }, [searchParams])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      router.push(`/blog/search?q=${encodeURIComponent(query)}`)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  return (
    <div className="min-h-screen bg-sage-50/30">
      {/* Header */}
      <header className="bg-white border-b border-sage-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-wood-dark mb-4">
              Search Blog
            </h1>
            
            {/* Search Form */}
            <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
              <div className="relative">
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search articles..."
                  className="w-full px-6 py-4 pr-14 border border-sage-200 rounded-full focus:ring-2 focus:ring-forest-500 focus:border-transparent text-lg"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-forest-600 text-white rounded-full hover:bg-forest-700 transition-colors"
                >
                  <Search className="h-5 w-5" />
                </button>
              </div>
            </form>
          </div>
        </div>
      </header>

      {/* Results */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {loading ? (
          <div className="text-center py-12">
            <p className="text-wood">Searching...</p>
          </div>
        ) : query ? (
          <>
            <p className="text-wood mb-8">
              Found <strong className="text-wood-dark">{total}</strong> results for &quot;<strong className="text-forest-700">{query}</strong>&quot;
            </p>

            {posts.length === 0 ? (
              <div className="text-center py-12">
                <Search className="h-16 w-16 mx-auto mb-4 opacity-20" />
                <h3 className="text-lg font-semibold text-wood-dark mb-2">No results found</h3>
                <p className="text-wood mb-6">Try searching with different keywords</p>
                <button
                  onClick={() => router.push('/blog')}
                  className="px-6 py-3 bg-forest-600 text-white rounded-lg hover:bg-forest-700 transition-colors"
                >
                  Browse All Posts
                </button>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {posts.map((post) => (
                  <article
                    key={post.id}
                    className="bg-white rounded-xl shadow-sm border border-sage-100 overflow-hidden hover:shadow-md transition-shadow"
                  >
                    {post.cover_image && (
                      <a href={`/blog/${post.slug}`} className="block aspect-video overflow-hidden">
                        <img
                          src={post.cover_image}
                          alt={post.title}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        />
                      </a>
                    )}

                    <div className="p-6">
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

                      <a href={`/blog/${post.slug}`}>
                        <h2 className="text-xl font-bold text-wood-dark mb-2 hover:text-forest-700 transition-colors line-clamp-2">
                          {post.title}
                        </h2>
                      </a>

                      <p className="text-wood mb-4 line-clamp-3">{post.excerpt}</p>

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

                      <a
                        href={`/blog/${post.slug}`}
                        className="inline-flex items-center gap-2 text-forest-700 font-medium hover:text-forest-800 transition-colors"
                      >
                        Read More
                        <ChevronRight className="h-4 w-4" />
                      </a>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <Search className="h-16 w-16 mx-auto mb-4 opacity-20" />
            <h3 className="text-lg font-semibold text-wood-dark mb-2">Start your search</h3>
            <p className="text-wood">Enter keywords to find articles</p>
          </div>
        )}
      </main>
    </div>
  )
}

export default function BlogSearchPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-wood">Loading search...</p>
      </div>
    }>
      <BlogSearchContent />
    </Suspense>
  )
}
