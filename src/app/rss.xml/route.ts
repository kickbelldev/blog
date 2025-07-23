import { NextResponse } from 'next/server'

import { generateRSSFeed } from '@/app/_lib/rss'
import { allPosts } from '@/domain/blog'

export const dynamic = 'force-static'

export async function GET() {
  try {
    // 날짜순으로 정렬된 포스트들
    const sortedPosts = allPosts.sort(
      (a, b) =>
        new Date(b.data.date).getTime() - new Date(a.data.date).getTime()
    )

    const rssXml = generateRSSFeed(sortedPosts)

    return new NextResponse(rssXml, {
      status: 200,
      headers: {
        'Content-Type': 'application/rss+xml; charset=utf-8',
      },
    })
  } catch (error) {
    console.error('RSS feed generation error:', error)
    return new NextResponse('Error generating RSS feed', {
      status: 500,
    })
  }
}
