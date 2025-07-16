import { notFound } from 'next/navigation'

import {
  PostContent,
  PostFooter,
  PostHeader,
  PostNavigation,
  RelatedPosts,
} from '@/app/posts/_components'
import { getAllPosts, getPostNavigation } from '@/entities/posts'
import { getRelatedPostsByTags } from '@/entities/tags'

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
  const decodedSlug = decodeURIComponent(slug)

  try {
    const { default: Post, frontmatter } = await import(
      `@/contents/${decodedSlug}.mdx`
    )

    const { previousPost, nextPost } = await getPostNavigation(decodedSlug)
    const relatedPosts = await getRelatedPostsByTags(decodedSlug)

    return (
      <div className="mx-auto px-5 py-8 max-w-4xl">
        <PostHeader {...frontmatter} />
        <PostContent>
          <Post />
        </PostContent>
        <PostFooter
          previousPost={previousPost}
          nextPost={nextPost}
          relatedPosts={relatedPosts}
        />
        <PostNavigation
          previousPost={previousPost}
          nextPost={nextPost}
        />
        <RelatedPosts posts={relatedPosts} />
      </div>
    )
  } catch (_error) {
    console.error(_error)
    notFound()
  }
}
