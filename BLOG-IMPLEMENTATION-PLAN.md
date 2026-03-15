# Blog + SEO Implementation Plan

## ✅ Completed (2026-03-15)

### Database Schema
- ✅ Migration `007_add_blog_and_comments.sql` created
- ✅ Posts table with SEO fields (meta_title, meta_description, meta_keywords)
- ✅ Comments table with moderation (pending/approved/spam)
- ✅ Categories and tags for posts
- ✅ RLS policies for security
- ✅ Sample data (5 categories, 7 tags)

### API Endpoints
- ✅ `GET /api/blog` — List posts with pagination, filtering
- ✅ `POST /api/blog` — Create new post
- ✅ `GET /api/blog/[slug]` — Get single post
- ✅ `PATCH /api/blog/[slug]` — Update post
- ✅ `DELETE /api/blog/[slug]` — Delete post
- ✅ `GET /api/comments` — Get comments for post
- ✅ `POST /api/comments` — Create comment

### Components
- ✅ `RichTextEditor` — Tiptap-based WYSIWYG editor
  - Bold, Italic, Strikethrough
  - Headings (H2, H3)
  - Lists (bullet, numbered)
  - Blockquotes
  - Code blocks
  - Images (URL)
  - Links
  - Undo/Redo

### Public Pages
- ✅ `/blog` — Blog listing with pagination
  - Post cards with cover images
  - Categories display
  - Excerpt preview
  - View count
  - Published date
  - Pagination controls

## 🔨 Still Needed

### Admin Pages
- [ ] `/admin/blog` — Post management list
- [ ] `/admin/blog/new` — Create post with Tiptap editor
- [ ] `/admin/blog/[id]/edit` — Edit post
- [ ] Category/tag management
- [ ] Comment moderation queue

### Public Pages
- [ ] `/blog/[slug]` — Post detail page
  - Full content rendering
  - Author info
  - Categories & tags
  - Comments section
  - Share buttons
  - Related posts

### SEO Implementation
- [ ] next-seo configuration
- [ ] Dynamic meta tags for posts
- [ ] Open Graph tags
- [ ] Twitter Card tags
- [ ] JSON-LD structured data
- [ ] next-sitemap configuration
- [ ] robots.txt optimization

### Additional Features
- [ ] Search functionality
- [ ] RSS feed
- [ ] Author profile pages
- [ ] Category/tag archive pages
- [ ] Draft preview
- [ ] Scheduled publishing
- [ ] Reading time estimate
- [ ] Table of contents (auto-generated)

## 📦 Installed Packages

```json
{
  "@tiptap/react": "^2.x",
  "@tiptap/starter-kit": "^2.x",
  "@tiptap/extension-image": "^2.x",
  "@tiptap/extension-link": "^2.x",
  "@tiptap/extension-placeholder": "^2.x",
  "next-seo": "^6.x",
  "next-sitemap": "^4.x"
}
```

## 🎯 Next Steps

1. **Create admin blog pages** (CRUD with Tiptap)
2. **Create post detail page** (`/blog/[slug]`)
3. **Add SEO components** (meta tags, sitemap)
4. **Create comment section component**
5. **Add comment moderation in admin**
6. **Test and deploy**

## 📝 Usage Examples

### Create Post (API)
```typescript
const response = await fetch('/api/blog', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    title: 'My Blog Post',
    slug: 'my-blog-post',
    excerpt: 'Short description...',
    content: '<p>HTML content from Tiptap...</p>',
    cover_image: 'https://...',
    category_ids: ['uuid-1', 'uuid-2'],
    tag_ids: ['uuid-3'],
    meta_title: 'SEO Title',
    meta_description: 'SEO description',
    status: 'published',
  }),
})
```

### Fetch Posts (API)
```typescript
const response = await fetch('/api/blog?page=1&limit=10&category=furniture-tips')
const data = await response.json()
// data.posts, data.pagination
```

### Use RichTextEditor Component
```tsx
import { RichTextEditor } from '@/components/blog/rich-text-editor'

<RichTextEditor
  content={postContent}
  onChange={setContent}
  placeholder="Write your post..."
/>
```

---

**Status:** Foundation complete, ready for admin UI and SEO implementation  
**Last Updated:** 2026-03-15
