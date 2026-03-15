'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Edit, Trash2, Eye, FileText, Loader2 } from 'lucide-react'

interface Post {
  id: string
  title: string
  slug: string
  status: 'draft' | 'published' | 'archived'
  published_at?: string
  views: number
  authors: { email: string }
}

export default function AdminBlogPage() {
  const router = useRouter()
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'published' | 'draft' | 'archived'>('all')

  const fetchPosts = async () => {
    try {
      const params = filter === 'all' ? '?status=all' : `?status=${filter}`
      const response = await fetch(`/api/blog${params}`)
      if (!response.ok) throw new Error('Failed to fetch posts')
      const data = await response.json()
      setPosts(data.posts)
    } catch (error) {
      console.error('Error fetching posts:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPosts()
  }, [filter])

  const handleDelete = async (slug: string) => {
    if (!confirm('Are you sure you want to delete this post?')) return
    
    try {
      const response = await fetch(`/api/blog/${slug}`, { method: 'DELETE' })
      if (!response.ok) throw new Error('Failed to delete')
      fetchPosts()
    } catch (error) {
      console.error('Error deleting post:', error)
      alert('Failed to delete post')
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-wood-dark">Blog Posts</h1>
          <p className="text-wood">Manage your blog content</p>
        </div>
        <button
          onClick={() => router.push('/admin/blog/new')}
          className="flex items-center gap-2 px-4 py-2 bg-wood text-white rounded-lg hover:bg-wood-dark transition-colors"
        >
          <Plus className="h-5 w-5" />
          New Post
        </button>
      </div>

      {/* Filter */}
      <div className="flex gap-2">
        {['all', 'published', 'draft', 'archived'].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status as any)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === status
                ? 'bg-wood text-white'
                : 'bg-white text-wood hover:bg-beige/50'
            }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </div>

      {/* Posts Table */}
      {loading ? (
        <div className="text-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-wood mx-auto" />
          <p className="text-wood mt-3">Loading posts...</p>
        </div>
      ) : posts.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-sage-100 p-12 text-center">
          <FileText className="h-16 w-16 mx-auto mb-4 opacity-20" />
          <h3 className="text-lg font-semibold text-wood-dark mb-2">No posts yet</h3>
          <p className="text-wood mb-6">Create your first blog post</p>
          <button
            onClick={() => router.push('/admin/blog/new')}
            className="px-6 py-3 bg-wood text-white rounded-lg hover:bg-wood-dark transition-colors"
          >
            Create Post
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-sage-100 overflow-hidden">
          <table className="w-full">
            <thead className="border-b border-beige-dark bg-beige/30">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-wood-dark">Title</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-wood-dark">Status</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-wood-dark">Author</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-wood-dark">Published</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-wood-dark">Views</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-wood-dark">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-beige-dark">
              {posts.map((post) => (
                <tr key={post.id} className="hover:bg-beige/20 transition-colors">
                  <td className="px-4 py-3">
                    <div>
                      <p className="font-medium text-wood-dark">{post.title}</p>
                      <p className="text-xs text-wood">{post.slug}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                      post.status === 'published' ? 'bg-green-100 text-green-700' :
                      post.status === 'draft' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {post.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-wood-dark">
                    {post.authors?.email || 'Unknown'}
                  </td>
                  <td className="px-4 py-3 text-sm text-wood">
                    {post.published_at ? formatDate(post.published_at) : '—'}
                  </td>
                  <td className="px-4 py-3 text-sm text-wood-dark">
                    {post.views || 0}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => router.push(`/blog/${post.slug}`)}
                        className="p-1.5 text-wood hover:text-wood-dark transition-colors"
                        title="View"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => router.push(`/admin/blog/${post.id}/edit`)}
                        className="p-1.5 text-wood hover:text-wood-dark transition-colors"
                        title="Edit"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(post.slug)}
                        className="p-1.5 text-red-500 hover:text-red-600 transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
