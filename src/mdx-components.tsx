import type { MDXComponents } from 'mdx/types'

import { generateHeadingId } from '@/domain/blog'

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    h1: ({ children, ...props }) => {
      const text = typeof children === 'string' ? children : String(children)
      const id = generateHeadingId(text)
      return (
        <h1
          id={id}
          {...props}
        >
          {children}
        </h1>
      )
    },
    h2: ({ children, ...props }) => {
      const text = typeof children === 'string' ? children : String(children)
      const id = generateHeadingId(text)
      return (
        <h2
          id={id}
          {...props}
        >
          {children}
        </h2>
      )
    },
    h3: ({ children, ...props }) => {
      const text = typeof children === 'string' ? children : String(children)
      const id = generateHeadingId(text)
      return (
        <h3
          id={id}
          {...props}
        >
          {children}
        </h3>
      )
    },
    h4: ({ children, ...props }) => {
      const text = typeof children === 'string' ? children : String(children)
      const id = generateHeadingId(text)
      return (
        <h4
          id={id}
          {...props}
        >
          {children}
        </h4>
      )
    },
    h5: ({ children, ...props }) => {
      const text = typeof children === 'string' ? children : String(children)
      const id = generateHeadingId(text)
      return (
        <h5
          id={id}
          {...props}
        >
          {children}
        </h5>
      )
    },
    h6: ({ children, ...props }) => {
      const text = typeof children === 'string' ? children : String(children)
      const id = generateHeadingId(text)
      return (
        <h6
          id={id}
          {...props}
        >
          {children}
        </h6>
      )
    },
    ...components,
  }
}
