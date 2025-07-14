import createMDX from '@next/mdx'
import type { NextConfig } from 'next'
import rehypePrettyCode, { type Options } from 'rehype-pretty-code'
import remarkFrontmatter from 'remark-frontmatter'
import remarkMdxFrontmatter from 'remark-mdx-frontmatter'

const nextConfig: NextConfig = {
  pageExtensions: [
    'js',
    'jsx',
    'md',
    'mdx',
    'ts',
    'tsx',
  ],
  output: 'export',
}

const withMDX = createMDX({
  extension: /\.(mdx)$/,
  options: {
    remarkPlugins: [
      remarkFrontmatter,
      remarkMdxFrontmatter,
    ],
    rehypePlugins: [
      [
        rehypePrettyCode,
        {
          theme: 'one-dark-pro',
        } as Options,
      ],
    ],
  },
})

export default withMDX(nextConfig)
