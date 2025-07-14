# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- `pnpm dev` - Start development server on localhost:3000
- `pnpm build` - Build the application for production (configured for static export)
- `pnpm start` - Start production server
- `pnpm biome:check` - Run Biome formatter and linter with auto-fix
- `pnpm biome:staged` - Run Biome on staged files only

## Code Quality

This project uses Biome for formatting and linting. Always run `pnpm biome:check` before committing changes. The project has a pre-commit hook (lefthook) that automatically runs Biome on staged files.

## Architecture Overview

### Next.js Blog with MDX

This is a Next.js 15 blog application configured for static export with MDX support for content authoring.

**Key Technologies:**
- Next.js 15 with App Router
- MDX for blog content with rehype-pretty-code syntax highlighting
- Tailwind CSS for styling
- TypeScript
- Biome for code formatting/linting

### Directory Structure

- `src/app/` - Next.js App Router pages and layouts
- `src/contents/` - MDX blog posts (*.mdx files)
- `src/api/posts.ts` - Blog post data fetching utilities
- `src/app/blog/[slug]/` - Dynamic blog post pages

### Content Management

Blog posts are stored as MDX files in `src/contents/`. The `src/api/posts.ts` module handles:
- Reading MDX files from the contents directory
- Parsing frontmatter with gray-matter
- Generating static routes for blog posts

### Static Generation

The app is configured for static export (`output: 'export'` in next.config.ts) and uses:
- `generateStaticParams()` for blog post routes
- Dynamic imports for MDX components in blog pages

### Styling

- Uses Tailwind CSS with custom configuration
- Noto Sans KR font for Korean language support
- Prose styling for blog content rendering

### Build Output

Static files are generated in the `out/` directory during build.