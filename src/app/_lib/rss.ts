import type { Post } from '@/domain/blog'

const SITE_URL = 'https://kickbelldev.github.com/blog'
const SITE_NAME = 'Kayce Blog'
const SITE_DESCRIPTION = '개발 경험과 일상의 생각들을 기록하는 블로그입니다.'

export function generateRSSFeed(posts: Post[]): string {
  const rssItems = posts
    .slice(0, 20) // 최신 20개 포스트만
    .map((post) => {
      const postUrl = `${SITE_URL}/${post.data.category || 'uncategorized'}/${post.slug}`
      const pubDate = new Date(post.data.date).toUTCString()

      return `
    <item>
      <title><![CDATA[${post.data.title}]]></title>
      <description><![CDATA[${post.data.description}]]></description>
      <link>${postUrl}</link>
      <guid>${postUrl}</guid>
      <pubDate>${pubDate}</pubDate>
      <author>noreply@kickbelldev.github.com (Kayce Kim)</author>
      ${post.data.category ? `<category>${post.data.category}</category>` : ''}
      ${post.data.tags?.map((tag) => `<category>${tag}</category>`).join('') || ''}
    </item>`.trim()
    })
    .join('\n')

  const lastBuildDate = new Date().toUTCString()
  const pubDate =
    posts.length > 0
      ? new Date(posts[0].data.date).toUTCString()
      : lastBuildDate

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${SITE_NAME}</title>
    <description>${SITE_DESCRIPTION}</description>
    <link>${SITE_URL}</link>
    <language>ko-KR</language>
    <lastBuildDate>${lastBuildDate}</lastBuildDate>
    <pubDate>${pubDate}</pubDate>
    <ttl>1440</ttl>
    <atom:link href="${SITE_URL}/rss.xml" rel="self" type="application/rss+xml"/>
    <managingEditor>noreply@kickbelldev.github.com (Kayce Kim)</managingEditor>
    <webMaster>noreply@kickbelldev.github.com (Kayce Kim)</webMaster>
    <copyright>Copyright ${new Date().getFullYear()} Kayce Kim. All rights reserved.</copyright>
    <category>Blog</category>
    <category>Development</category>
    <category>Personal</category>
    <generator>Next.js RSS Generator</generator>
${rssItems}
  </channel>
</rss>`.trim()
}

export function generateAtomFeed(posts: Post[]): string {
  const atomEntries = posts
    .slice(0, 20)
    .map((post) => {
      const postUrl = `${SITE_URL}/${post.data.category || 'uncategorized'}/${post.slug}`
      const updated = new Date(post.data.date).toISOString()

      return `
  <entry>
    <title type="html"><![CDATA[${post.data.title}]]></title>
    <link href="${postUrl}"/>
    <updated>${updated}</updated>
    <id>${postUrl}</id>
    <content type="html"><![CDATA[${post.data.description}]]></content>
    <author>
      <name>Kayce Kim</name>
      <email>noreply@kickbelldev.github.com</email>
    </author>
    ${post.data.category ? `<category term="${post.data.category}"/>` : ''}
    ${post.data.tags?.map((tag) => `<category term="${tag}"/>`).join('') || ''}
  </entry>`.trim()
    })
    .join('\n')

  const updated =
    posts.length > 0
      ? new Date(posts[0].data.date).toISOString()
      : new Date().toISOString()

  return `<?xml version="1.0" encoding="UTF-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <title>${SITE_NAME}</title>
  <subtitle>${SITE_DESCRIPTION}</subtitle>
  <link href="${SITE_URL}/atom.xml" rel="self"/>
  <link href="${SITE_URL}"/>
  <updated>${updated}</updated>
  <id>${SITE_URL}/</id>
  <author>
    <name>Kayce Kim</name>
    <email>noreply@kickbelldev.github.com</email>
  </author>
  <generator uri="https://nextjs.org/" version="${process.env.npm_package_version || '1.0.0'}">Next.js</generator>
${atomEntries}
</feed>`.trim()
}
