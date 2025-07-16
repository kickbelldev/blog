import { notFound } from 'next/navigation'

import { PostContent, PostFooter, PostHeader } from '@/app/posts/_components'
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
    const { default: Post, frontmatter } = await import(
      `@/contents/${decodeURIComponent(slug)}.mdx`
    )

    return (
      <div className="container mx-auto px-5 py-8 max-w-4xl">
        <PostHeader {...frontmatter} />
        <PostContent>
          <Post />
        </PostContent>
        <PostFooter />
      </div>
    )
  } catch (_error) {
    console.error(_error)
    notFound()
  }
}
