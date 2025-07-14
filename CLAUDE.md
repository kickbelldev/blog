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

## Git Workflow

### Branch Strategy
- **Main branch**: `main` - production-ready code
- **Feature branches**: `feature/description` or `feat/short-name` for new features
- **Bug fixes**: `fix/description` or `bugfix/issue-number` for bug fixes
- **Documentation**: `docs/description` for documentation updates

### Commit Message Convention
Follow conventional commits format for clear, searchable history:

```
<type>: <description>

[optional body]

🤖 Generated with [Claude Code](https://claude.ai/code)

Co-Authored-By: Claude <noreply@anthropic.com>
```

**Types:**
- `feat:` - new features
- `fix:` - bug fixes  
- `docs:` - documentation updates
- `config:` - configuration changes
- `refactor:` - code refactoring without feature changes
- `chore:` - maintenance tasks, dependency updates

**Examples:**
- `feat: 블로그 포스트 검색 기능 추가`
- `fix: 모바일에서 네비게이션 메뉴 깨짐 수정`
- `docs: CLAUDE.md에 Git 워크플로우 가이드 추가`

### Pull Request Process
1. Create feature branch from `main`
2. Implement changes with descriptive commits
3. Run `pnpm biome:check` and ensure build passes
4. Create PR with clear title and description
5. Link related issues if applicable
6. Merge after review (if working in team) or directly (if solo)

### Pre-commit Hooks
The project uses lefthook to automatically run quality checks:
- Biome formatting and linting on staged files
- Prevents commits with linting errors
- Ensures consistent code style across the project

## Claude Code Workflow Instructions

**IMPORTANT**: Claude Code must follow this PR-based workflow for ALL development tasks:

### 1. Before Starting Any Task
```bash
# Ensure you're on main and up to date
git checkout main
git pull origin main

# Create a new feature branch
git checkout -b <type>/<description>
```

### 2. Branch Naming Convention
- `feat/기능명` - New features (e.g., `feat/search-functionality`)
- `fix/버그명` - Bug fixes (e.g., `fix/mobile-nav-issue`)
- `docs/문서명` - Documentation updates (e.g., `docs/readme-update`)
- `config/설정명` - Configuration changes (e.g., `config/eslint-setup`)
- `refactor/리팩터명` - Code refactoring (e.g., `refactor/component-structure`)
- `chore/작업명` - Maintenance tasks (e.g., `chore/dependency-update`)

### 3. After Completing Work
```bash
# Stage and commit changes
git add .
git commit -m "conventional commit message"

# Push to remote
git push -u origin <branch-name>

# Create PR immediately
gh pr create --title "PR Title" --body "$(cat <<'EOF'
## Summary
- Brief description of changes
- Key implementation details

## Test plan
- [ ] Checklist item 1
- [ ] Checklist item 2

🤖 Generated with [Claude Code](https://claude.ai/code)
EOF
)"
```

### 4. PR Requirements
- **Always create PRs**: Never commit directly to main
- **Clear titles**: Use conventional commit format in PR titles
- **Detailed descriptions**: Include Summary and Test plan sections
- **Link issues**: Reference related GitHub issues when applicable
- **Quality checks**: Ensure CI passes before requesting review

### 5. Work Scope Guidelines
- **One logical change per PR**: Keep PRs focused and reviewable
- **Complete features**: Don't leave work in broken state
- **Test your changes**: Run `pnpm biome:check` and `pnpm build` before committing
- **Document breaking changes**: Clearly explain any breaking changes

### 6. After PR Creation
- Wait for CI checks to pass
- Address any review feedback
- Merge only after approval (if working in team) or when CI is green (if solo)

**Remember**: This workflow ensures clean git history, proper code review, and CI validation for all changes.

## Architecture Overview

### Next.js Blog with MDX

This is a Next.js 15 blog application configured for static export with MDX support for content authoring.

**Key Technologies:**
- Next.js 15 with App Router
- MDX for blog content with rehype-pretty-code syntax highlighting
- Tailwind CSS for styling
- shadcn/ui for UI components
- TypeScript
- Biome for code formatting/linting

### Directory Structure

All client-side code is organized under `src/app/` following Next.js App Router conventions with a package-like structure:

- `src/app/` - Next.js App Router root directory
  - `_components/` - Global reusable React components (underscore prevents routing)
  - `_hooks/` - Global custom React hooks (underscore prevents routing)
  - `_fonts/` - Font configurations (underscore prevents routing)
  - `_lib/` - Global utility functions and libraries (underscore prevents routing)
  - `about/` - About page route
    - `_components/` - Components specific to about page only
    - `_hooks/` - Hooks specific to about page only
    - `page.tsx` - About page component
  - `blog/` - Blog routes
    - `_components/` - Components specific to blog functionality
    - `_hooks/` - Hooks specific to blog functionality
    - `[slug]/` - Dynamic blog post pages
    - `page.tsx` - Blog index page
  - `layout.tsx` - Root layout component
  - `page.tsx` - Home page
  - `not-found.tsx` - 404 error page
  - `globals.css` - Global styles
- `src/api/` - Server-side utilities (outside app directory)
  - `posts.ts` - Blog post data fetching utilities
- `src/contents/` - MDX blog posts (*.mdx files)

**Naming Convention:** 
- Use underscore prefix (`_`) for folders that should not be treated as routes by Next.js App Router
- Follow Java package-like structure: components and hooks are organized by their scope
  - Global scope: `src/app/_components/`, `src/app/_hooks/`
  - Page/Feature scope: `src/app/[route]/_components/`, `src/app/[route]/_hooks/`
- This ensures components and logic are co-located with their usage while maintaining clear boundaries

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
- shadcn/ui components with "new-york" style and stone base color
- CSS variables for theming (light/dark mode support)
- Noto Sans KR font for Korean language support
- Prose styling for blog content rendering

### UI Components

This project uses shadcn/ui for consistent, high-quality UI components:
- **Installation**: Use `npx shadcn@latest add <component>` to add new components
- **Location**: UI components are placed in `src/app/_components/ui/`
- **Style**: Configured with "new-york" style and stone base color
- **Theming**: Full CSS variables support for light/dark themes
- **Icons**: Uses Lucide React for icons
- **Utilities**: `cn()` function in `src/app/_lib/utils.ts` for conditional styling

### Build Output

Static files are generated in the `out/` directory during build.