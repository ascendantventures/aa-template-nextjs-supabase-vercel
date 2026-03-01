# SCAFFOLD_MANIFEST.md

_Filled in by the scaffold agent. BUILD agent reads this before starting._

## Project

- **Issue:** #{{ISSUE_NUMBER}}
- **Submission ID:** {{SUBMISSION_ID}}
- **App Name:** {{APP_NAME}}
- **Scaffolded at:** {{TIMESTAMP}}

## Environment

- **Supabase Project URL:** {{SUPABASE_URL}}
- **Vercel Project:** {{VERCEL_PROJECT_NAME}}
- **Node version:** 22
- **Package manager:** pnpm

## What the scaffold did

- [ ] Template cloned from `aa-template-nextjs-supabase-vercel`
- [ ] `.env.local` written with Supabase URL + keys
- [ ] Supabase migrations run: {{MIGRATION_LIST}}
- [ ] `pnpm install` passed
- [ ] `pnpm build` passed

## BUILD instructions

See `BUILD_INSTRUCTIONS.md` for the full spec and acceptance criteria.

The scaffold has set up:
- Auth (better-auth + email/password)
- Supabase client (server + browser)
- Route groups: `(auth)` and `(dashboard)`
- `/api/auth/[...all]` handler
- `/api/health` health check
- Middleware with auth guard
- Base UI primitives (button, card, input, etc.)

The BUILD agent implements:
- Domain model (schema, types)
- API routes for domain entities
- Dashboard pages
- Domain-specific components
