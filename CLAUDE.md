# CLAUDE.md


## Project: harufit

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## About

A daily health management web app providing workout routine tracking, diet logging, and AI-generated feedback.

> **Read first:** See `docs/planning.md` for the full product spec, DB schema, route structure, and component breakdown before making changes.

## Tech Stack

- **Framework**: Next.js 16 (App Router, `src/` directory)
- **Styling**: Tailwind CSS v4
- **Database & Auth**: Supabase (PostgreSQL + Auth + Storage)
- **AI**: Anthropic Claude API (diet feedback feature)
- **Deployment**: Vercel

> **Note:** Node.js >=20.9.0 is required by Next.js 16.

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── (auth)/             # Login / sign-up
│   ├── (dashboard)/        # Main app (auth required)
│   │   ├── routine/        # Workout routine management
│   │   ├── diet/           # Diet logging
│   │   └── history/        # History view
│   └── api/                # API Routes
│       └── ai-comment/     # Claude API call
├── components/             # Shared components
├── lib/
│   ├── supabase/           # Supabase clients (client / server / middleware)
│   └── anthropic/          # Claude API utils
├── middleware.ts            # Supabase session refresh middleware
└── types/                  # TypeScript type definitions
```

## Key Features

1. **Workout Routine**: Create routines → check off today's exercises → log completion
2. **Diet Log**: Input meals by category (breakfast / lunch / dinner / snack)
3. **AI Comment**: Once per day, Claude generates feedback based on the day's diet log

## Database Schema (Supabase)

- `users` — linked to Supabase Auth
- `routines` — workout routine templates
- `routine_logs` — daily routine completion records
- `diet_logs` — diet records by date and meal
- `ai_comments` — AI comments (one per day limit)

## Dev Commands

```bash
npm run dev     # Dev server (localhost:3000)
npm run build   # Production build
npm run lint    # ESLint check
```

## Environment Variables

Set in `.env.local`:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `ANTHROPIC_API_KEY`

## Supabase Client Pattern

Use the correct client for each rendering context:

| File | Used in |
|------|---------|
| `src/lib/supabase/client.ts` | Client Components (`'use client'`) |
| `src/lib/supabase/server.ts` | Server Components, Route Handlers, Server Actions |
| `src/lib/supabase/middleware.ts` | `src/proxy.ts` only |

Do not remove `src/proxy.ts` — it refreshes Supabase sessions on every request.

## Conventions

- Components: PascalCase (`DietCard.tsx`)
- API Routes: `src/app/api/[feature]/route.ts`
- Supabase queries are extracted as functions under `src/lib/supabase/`
- All AI logic must run server-side (`api/` routes only) — never expose `ANTHROPIC_API_KEY` to the client

## Theme
- Dark/light mode support
- Default: follows system preference (`prefers-color-scheme`)
- CSS custom properties in `globals.css` handle dark mode (no `next-themes` — pure CSS approach)
- All components should include `dark:` Tailwind variants