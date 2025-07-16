import { notFound } from 'next/navigation'

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
      <div className="prose prose-stone">
        <Post />
      </div>
    )
  } catch (_error) {
    console.error(_error)
    notFound()
  }
}
