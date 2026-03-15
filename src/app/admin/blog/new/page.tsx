'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Save, Loader2 } from 'lucide-react'
import { RichTextEditor } from '@/components/blog/rich-text-editor'

export default function AdminBlogNewPage() {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    cover_image: '',
    meta_title: '',
    meta_description: '',
    meta_keywords: '',
    status: 'draft',
  })

  // Auto-generate slug from title
  const handleTitleChange = (title: string) => {
    setFormData(prev => ({
      ...prev,
      title,
      slug: !prev.slug ? title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') : prev.slug,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const response = await fetch('/api/blog', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to create post')
      }

      const data = await response.json()
      
      if (formData.status === 'published') {
        router.push(`/blog/${formData.slug}`)
      } else {
        router.push('/admin/blog')
      }
    } catch (error: any) {
      alert(`Error: ${error.message}`)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-wood hover:text-wood-dark transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>Back</span>
        </button>
        <div>
          <h1 className="text-2xl font-bold text-wood-dark">Create New Post</h1>
          <p className="text-wood">Write your blog post</p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <div className="bg-white rounded-xl shadow-sm border border-sage-100 p-6 space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-wood-dark mb-2">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="title"
              value={formData.title}
              onChange={(e) => handleTitleChange(e.target.value)}
              required
              className="w-full px-4 py-3 border border-beige-dark rounded-lg focus:ring-2 focus:ring-wood focus:border-transparent"
              placeholder="Enter post title"
            />
          </div>

          <div>
            <label htmlFor="slug" className="block text-sm font-medium text-wood-dark mb-2">
              Slug (URL) <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="slug"
              value={formData.slug}
              onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
              required
              className="w-full px-4 py-3 border border-beige-dark rounded-lg focus:ring-2 focus:ring-wood focus:border-transparent"
              placeholder="post-url-slug"
            />
            <p className="text-xs text-wood mt-1">Final URL: /blog/{formData.slug || '[slug]'} </p>
          </div>

          <div>
            <label htmlFor="excerpt" className="block text-sm font-medium text-wood-dark mb-2">
              Excerpt <span className="text-sage-400">(optional)</span>
            </label>
            <textarea
              id="excerpt"
              value={formData.excerpt}
              onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
              rows={3}
              className="w-full px-4 py-3 border border-beige-dark rounded-lg focus:ring-2 focus:ring-wood focus:border-transparent resize-none"
              placeholder="Short description for listings and SEO"
            />
          </div>

          <div>
            <label htmlFor="cover_image" className="block text-sm font-medium text-wood-dark mb-2">
              Cover Image URL <span className="text-sage-400">(optional)</span>
            </label>
            <input
              type="url"
              id="cover_image"
              value={formData.cover_image}
              onChange={(e) => setFormData(prev => ({ ...prev, cover_image: e.target.value }))}
              className="w-full px-4 py-3 border border-beige-dark rounded-lg focus:ring-2 focus:ring-wood focus:border-transparent"
              placeholder="https://..."
            />
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-xl shadow-sm border border-sage-100 p-6">
          <label className="block text-sm font-medium text-wood-dark mb-2">
            Content <span className="text-red-500">*</span>
          </label>
          <RichTextEditor
            content={formData.content}
            onChange={(content) => setFormData(prev => ({ ...prev, content }))}
            placeholder="Write your post content..."
          />
        </div>

        {/* SEO */}
        <div className="bg-white rounded-xl shadow-sm border border-sage-100 p-6 space-y-4">
          <h3 className="font-semibold text-wood-dark">SEO Settings</h3>
          
          <div>
            <label htmlFor="meta_title" className="block text-sm font-medium text-wood-dark mb-2">
              Meta Title <span className="text-sage-400">(optional, defaults to post title)</span>
            </label>
            <input
              type="text"
              id="meta_title"
              value={formData.meta_title}
              onChange={(e) => setFormData(prev => ({ ...prev, meta_title: e.target.value }))}
              className="w-full px-4 py-3 border border-beige-dark rounded-lg focus:ring-2 focus:ring-wood focus:border-transparent"
              placeholder="SEO title (50-60 characters)"
              maxLength={60}
            />
          </div>

          <div>
            <label htmlFor="meta_description" className="block text-sm font-medium text-wood-dark mb-2">
              Meta Description <span className="text-sage-400">(optional)</span>
            </label>
            <textarea
              id="meta_description"
              value={formData.meta_description}
              onChange={(e) => setFormData(prev => ({ ...prev, meta_description: e.target.value }))}
              rows={2}
              className="w-full px-4 py-3 border border-beige-dark rounded-lg focus:ring-2 focus:ring-wood focus:border-transparent resize-none"
              placeholder="SEO description (150-160 characters)"
              maxLength={160}
            />
          </div>

          <div>
            <label htmlFor="meta_keywords" className="block text-sm font-medium text-wood-dark mb-2">
              Meta Keywords <span className="text-sage-400">(optional, comma-separated)</span>
            </label>
            <input
              type="text"
              id="meta_keywords"
              value={formData.meta_keywords}
              onChange={(e) => setFormData(prev => ({ ...prev, meta_keywords: e.target.value }))}
              className="w-full px-4 py-3 border border-beige-dark rounded-lg focus:ring-2 focus:ring-wood focus:border-transparent"
              placeholder="keyword1, keyword2, keyword3"
            />
          </div>
        </div>

        {/* Status */}
        <div className="bg-white rounded-xl shadow-sm border border-sage-100 p-6">
          <label className="block text-sm font-medium text-wood-dark mb-3">
            Status
          </label>
          <div className="flex gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="status"
                value="draft"
                checked={formData.status === 'draft'}
                onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                className="text-forest-600 focus:ring-forest-500"
              />
              <span className="text-wood-dark">Draft</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="status"
                value="published"
                checked={formData.status === 'published'}
                onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                className="text-forest-600 focus:ring-forest-500"
              />
              <span className="text-wood-dark">Published</span>
            </label>
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-3 border border-beige-dark rounded-lg text-wood hover:bg-beige/50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-6 py-3 bg-wood text-white rounded-lg hover:bg-wood-dark transition-colors disabled:opacity-50"
          >
            {saving ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save className="h-5 w-5" />
                <span>Save Post</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
