import { notFound } from 'next/navigation'

import { PostContent } from '@/app/posts/_components'
import { getAllPosts } from '@/entities/posts'

export async function generateStaticParams() {
  const posts = await getAllPosts()

  const params = posts.map((post) => ({
    slug: encodeURIComponent(post.slug),
  }))

  return params
}

export default async function PostPage({
  params,
}: {
  params: Promise<{
    slug: string
  }>
}) {
  const { slug } = await params

  try {
    const { default: Post } = await import(
      `@/contents/${decodeURIComponent(slug)}.mdx`
    )

    return (
      <div className="container mx-auto px-5 py-8 max-w-4xl">
        <PostContent>
          <Post />
        </PostContent>
      </div>
    )
  } catch (_error) {
    console.error(_error)
    notFound()
  }
}
