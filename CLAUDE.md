# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- `pnpm dev` - Start development server on localhost:3000
- `pnpm build` - Build the application for production (configured for static export)
- `pnpm start` - Start production server
- `pnpm biome:check` - Run Biome formatter and linter
- `pnpm biome:fix` - Run Biome formatter and linter with auto-fix
- `pnpm biome:staged` - Run Biome on staged files only

## Code Quality

This project uses Biome for formatting and linting. Always run `pnpm biome:check` before committing changes. The project has a pre-commit hook (lefthook) that automatically runs Biome on staged files.

**IMPORTANT**: 
- Do NOT run `pnpm build` during development tasks unless specifically requested by the user. The build process is mainly for final deployment verification.
- When implementing new pages or components, use placeholders instead of actual content. Show what type of content should go in each position rather than writing fake content.
- Do NOT create UI structures arbitrarily. Always ask the user for specific requirements and approval before implementing any UI design or structure.

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

### Pre-commit Hooks
The project uses lefthook to automatically run quality checks

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
- `feat/` - New features (e.g., `feat/search-functionality`)
- `fix/` - Bug fixes (e.g., `fix/mobile-nav-issue`)
- `docs/` - Documentation updates (e.g., `docs/readme-update`)
- `config/` - Configuration changes (e.g., `config/eslint-setup`)
- `refactor/` - Code refactoring (e.g., `refactor/component-structure`)
- `chore/` - Maintenance tasks (e.g., `chore/dependency-update`)

### 3. After Completing Work
```bash
# Stage and commit changes LOGICALLY
# DO NOT commit everything at once - break into logical commits
git add [specific files for logical group 1]
git commit -m "conventional commit message for group 1"

git add [specific files for logical group 2] 
git commit -m "conventional commit message for group 2"

# Push to remote
git push -u origin <branch-name>

# Create PR immediately
gh pr create --title "PR Title" --body "$(cat <<'EOF'
## Summary
- Brief description of changes
- Key implementation details

## Checklist
- [ ] Checklist item 1
- [ ] Checklist item 2

🤖 Generated with [Claude Code](https://claude.ai/code)
EOF
)"
```

**IMPORTANT**: When the user asks to commit changes, NEVER create a single large commit. Always break changes into logical, separate commits such as:
- Documentation changes
- Configuration changes  
- New component implementations
- Layout/styling updates
- Bug fixes
Each commit should represent one logical change or feature.

### 4. PR Requirements
- **Always create PRs**: Never commit directly to main
- **Clear titles**: Use conventional commit format in PR titles
- **Detailed descriptions**: Include Summary and Test plan sections
- **Link issues**: Reference related GitHub issues when applicable

### 5. Work Scope Guidelines
- **One logical change per PR**: Keep PRs focused and reviewable
- **Complete features**: Don't leave work in broken state
- **Test your changes**: Run `pnpm biome:fix` before committing
- **Document breaking changes**: Clearly explain any breaking changes
- **Use placeholders**: When implementing new pages/components, use placeholders like "[Page Title]", "[Description]", "[Content]" instead of actual content
- **No arbitrary UI**: Do NOT create UI structures without explicit user requirements and approval

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
  - `about/` - About page route
  - `blog/` - Blog routes
    - `[slug]/` - Dynamic blog post pages
  - `layout.tsx` - Root layout component
  - `page.tsx` - Home page
  - `not-found.tsx` - 404 error page
  - `globals.css` - Global styles
- `src/entities/` - Domain entities and business logic (outside app directory)
- `src/contents/` - MDX blog posts (*.mdx files)

**Naming Convention:** 
- Use underscore prefix (`_`) for folders that should not be treated as routes by Next.js App Router
- Follow Java package-like structure: components and hooks are organized by their scope
  - Global scope: `src/app/_components/`, `src/app/_hooks/`
  - Page/Feature scope: `src/app/[route]/_components/`, `src/app/[route]/_hooks/`
- This ensures components and logic are co-located with their usage while maintaining clear boundaries

### Domain Architecture

This project follows Domain-Driven Design principles with entities organized in `src/entities/`:

- `src/entities/posts/` - Blog post domain logic
  - Repository pattern for data access
  - Post entity with type definitions
  - Business logic for post operations
- `src/entities/tags/` - Tag system domain logic
  - Tag entity and graph relationships
  - Tag operations and queries
  - Graph-based tag analysis

### Content Management

Blog posts are stored as MDX files in `src/contents/`. Each MDX file contains:
- **Frontmatter**: YAML metadata with `title`, `date`, `slug`, and `tags` information
- **Content**: Markdown content with JSX component support

The post entity in `src/entities/posts/` handles parsing and processing of these MDX files.

### Static Generation

The app is configured for static export (`output: 'export'` in next.config.ts) and uses:
- `generateStaticParams()` for blog post routes
- Dynamic imports for MDX components in blog pages

### Styling

- Uses Tailwind CSS with custom configuration
- shadcn/ui for UI components
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
- **Color Palette**: Always use `stone` color palette for consistent design (e.g., `text-stone-900`, `border-stone-200`, `bg-stone-50`)

### Build Output

Static files are generated in the `out/` directory during build.