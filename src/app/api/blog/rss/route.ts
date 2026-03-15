import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

// GET /api/blog/rss - Generate RSS feed
export async function GET() {
  try {
    const { data: posts } = await supabaseAdmin
      .from('posts')
      .select(`
        *,
        authors:author_id (email)
      `)
      .eq('status', 'published')
      .order('published_at', { ascending: false })
      .limit(20)

    const siteUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://aurahomelk.com'
    const buildDate = new Date().toUTCString()

    const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Aura Home Blog</title>
    <link>${siteUrl}/blog</link>
    <description>Tips, trends, and inspiration for your home</description>
    <language>en-us</language>
    <lastBuildDate>${buildDate}</lastBuildDate>
    <atom:link href="${siteUrl}/api/blog/rss" rel="self" type="application/rss+xml" />
    ${posts?.map(post => `
    <item>
      <title><![CDATA[${post.title}]]></title>
      <link>${siteUrl}/blog/${post.slug}</link>
      <guid isPermaLink="true">${siteUrl}/blog/${post.slug}</guid>
      <description><![CDATA[${post.excerpt || post.title}]]></description>
      <pubDate>${new Date(post.published_at).toUTCString()}</pubDate>
      ${post.authors?.email ? `<author>${post.authors.email}</author>` : ''}
    </item>
    `).join('')}
  </channel>
</rss>`

    return new NextResponse(rss, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, s-maxage=3600',
      },
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
