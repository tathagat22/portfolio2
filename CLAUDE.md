# Kautilya Portfolio — Claude Code Configuration

## Project Overview

Next.js 14 (App Router) portfolio for **Kautilya Yashovardhan**, a 3D artist & animation designer.
Stack: TypeScript · TailwindCSS · GSAP · Framer Motion · Lenis · Three.js / R3F · Contentful (CMS).

Key files:
- `src/lib/utils/constants.ts` — all projects, experience, skills, social links (single source of truth)
- `src/app/globals.css` — CSS variables + global styles
- `src/components/sections/` — page sections (Hero, About, WorkGrid, etc.)
- `src/components/layout/` — Navbar, Footer, Cursor, MobileMenu
- `public/images/portfolio/` — project thumbnails

---

## Agent Model Routing

Use these model assignments when spawning sub-agents or choosing models for tasks:

### Use **claude-haiku-4-5-20251001** (cheapest, fast) for:
- File search, grep, glob, listing files
- Reading and summarizing existing code (no reasoning needed)
- Linting / formatting fixes
- Renaming variables, updating constants/data arrays
- Writing boilerplate (imports, types, prop interfaces)
- Generating placeholder/stub components

### Use **claude-sonnet-4-6** (balanced, default) for:
- Component implementation (UI + logic)
- CSS/animation work (GSAP, Framer Motion timelines)
- Refactoring existing sections
- Integrating third-party libraries (Three.js, Lenis, Contentful)
- Debugging TypeScript/build errors
- Writing hooks and utility functions
- Code review and audit tasks

### Use **claude-opus-4-7** (most capable, expensive) for:
- Full-page redesign / high-creativity frontend work
- Complex architectural decisions (state management, routing strategy)
- Multi-section layout design with advanced animation choreography
- Tasks where aesthetic judgment and creative synthesis matter
- Designing from scratch when given an open-ended brief

---

## Conventions

- **No comments** unless the WHY is non-obvious (a subtle invariant, a workaround for a bug).
- Prefer editing existing files over creating new ones.
- No extra abstractions beyond what the task requires.
- Use CSS variables (`--accent-cyan`, `--bg-primary`, etc.) for theming — never hardcode colors.
- All project data lives in `constants.ts`. Never duplicate it in component files.
- Placeholders: use `<video>` tags with `poster` attributes for video; use `<ModelViewer>` wrapper for 3D — never block render on missing assets.
- Smooth scroll is handled by Lenis — do not add `scroll-behavior: smooth` to CSS.
- Custom cursor is global (`CustomCursor.tsx`) — sections should not render their own cursors.

## Asset Placeholders

Videos → `<video autoPlay muted loop playsInline poster="/images/portfolio/[thumb].jpg" />`  
3D Models → wrap in `<Suspense>` with a poster/image fallback, use `ModelViewer.tsx` pattern.

## Tech Constraints

- Next.js 14 App Router — `"use client"` required for GSAP/Framer hooks.
- GSAP `ScrollTrigger` must be registered once; use `GSAPProvider.tsx`.
- Lenis scroll context available via `LenisProvider.tsx`.
- Tailwind v3 — use JIT, no arbitrary values if a CSS variable can be used instead.
