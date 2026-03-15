/**
 * Calculate reading time for blog post content
 * Assumes average reading speed of 200 words per minute
 */
export function calculateReadingTime(content: string): number {
  // Strip HTML tags
  const plainText = content.replace(/<[^>]*>/g, '')
  
  // Count words
  const wordCount = plainText.split(/\s+/).filter(word => word.length > 0).length
  
  // Calculate minutes (200 words per minute average)
  const minutes = Math.ceil(wordCount / 200)
  
  return Math.max(1, minutes) // Minimum 1 minute
}

/**
 * Generate table of contents from HTML content
 * Extracts H2 and H3 headings
 */
export interface TOCItem {
  id: string
  text: string
  level: number
  children?: TOCItem[]
}

export function generateTableOfContents(content: string): TOCItem[] {
  const toc: TOCItem[] = []
  const headingRegex = /<h([23])[^>]*>(.*?)<\/h\1>/gi
  let match
  
  while ((match = headingRegex.exec(content)) !== null) {
    const level = parseInt(match[1])
    const text = match[2].replace(/<[^>]*>/g, '')
    const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-')
    
    toc.push({
      id,
      text,
      level,
    })
  }
  
  return toc
}

/**
 * Add IDs to headings in HTML content for TOC linking
 */
export function addHeadingIds(content: string): string {
  return content.replace(/<h([23])[^>]*>(.*?)<\/h\1>/gi, (match, level, text) => {
    const id = text.replace(/<[^>]*>/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-')
    return `<h${level} id="${id}">${text}</h${level}>`
  })
}

/**
 * Find related posts based on categories and tags
 */
export function findRelatedPosts(
  currentPostId: string,
  currentCategories: string[],
  currentTags: string[],
  allPosts: any[]
): any[] {
  // Score posts by shared categories and tags
  const scored = allPosts
    .filter(post => post.id !== currentPostId)
    .map(post => {
      let score = 0
      
      // Score by shared categories
      const postCategories = post.categories?.map((c: any) => c.category?.slug) || []
      const sharedCategories = currentCategories.filter(cat => postCategories.includes(cat))
      score += sharedCategories.length * 2
      
      // Score by shared tags
      const postTags = post.tags?.map((t: any) => t.tag?.slug) || []
      const sharedTags = currentTags.filter(tag => postTags.includes(tag))
      score += sharedTags.length
      
      return { ...post, score }
    })
    .filter(post => post.score > 0)
    .sort((a, b) => b.score - a.score)
  
  // Return top 3 related posts
  return scored.slice(0, 3)
}
