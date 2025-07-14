import createMDX from '@next/mdx'
import type { NextConfig } from 'next'
import rehypePrettyCode, { type Options } from 'rehype-pretty-code'

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
