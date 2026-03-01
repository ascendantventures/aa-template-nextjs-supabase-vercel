# CLAUDE.md — Agent Instructions

This project was generated from the Angel Agents template. Read this file before writing any code.

## Stack
- **Next.js 15** (App Router, TypeScript, Turbopack)
- **Supabase** (PostgreSQL + Auth via Supabase SSR)
- **Better Auth** (session management, wired to Supabase adapter)
- **Tailwind CSS v4** (CSS-based config, `@import "tailwindcss"` in globals.css)
- **shadcn/ui** components in `src/components/ui/`
- **pnpm** (never use npm or yarn)
- **Vercel** (deployment target)

## Project Structure

```
src/
  app/
    (auth)/          # Login, register pages (no sidebar nav)
    (dashboard)/     # Authenticated app pages (with sidebar nav)
    api/             # API routes
  components/
    layout/          # Header, Sidebar (shared layout)
    ui/              # shadcn/ui components
  lib/
    auth.ts          # Better Auth server config
    auth-client.ts   # Better Auth client hooks
    env.ts           # Zod env schema (validates at startup)
    supabase/
      client.ts      # Browser Supabase client
      server.ts      # Server Supabase client (cookies)
  types/
    database.ts      # Supabase generated types (update after schema changes)
  middleware.ts      # Route protection (redirects unauthenticated users)
migrations/
  000_better_auth_schema.sql  # Base auth migration (already applied)
SCAFFOLD_MANIFEST.md          # What the scaffold agent did — read this first
```

## Hard Rules

1. **`pnpm build` must pass before opening a PR.** Run it. Fix errors. No exceptions.
2. **No `any` types.** If you're tempted to use `any`, use `unknown` and narrow properly.
3. **Server components by default.** Add `"use client"` only when needed (event handlers, hooks, browser APIs).
4. **All API routes return `NextResponse.json()`**. Never return plain `Response`.
5. **Env vars via `src/lib/env.ts`.** Never use `process.env.X` directly — import from env.ts.
6. **Every page route that requires auth must be in `(dashboard)/`** — middleware protects it automatically.

## Auth Pattern

```typescript
// Server component — get session
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

const session = await auth.api.getSession({ headers: await headers() });
if (!session) redirect("/login");

// Client component — get session
import { useSession } from "@/lib/auth-client";
const { data: session } = useSession();

// API route — get session
import { auth } from "@/lib/auth";
const session = await auth.api.getSession({ headers: request.headers });
if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
```

## Supabase Pattern

```typescript
// Server component / API route
import { createServerClient } from "@/lib/supabase/server";
const supabase = createServerClient();
const { data, error } = await supabase.from("table").select("*");

// Client component
import { createBrowserClient } from "@/lib/supabase/client";
const supabase = createBrowserClient();
```

## Tailwind CSS v4

- Config is CSS-based: `src/app/globals.css` has `@import "tailwindcss";`
- No `tailwind.config.ts` — use CSS custom properties for theme overrides
- Utility classes work the same as v3

## API Route Pattern

```typescript
// src/app/api/resource/route.ts
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // ... implementation
  return NextResponse.json({ data });
}
```

## Database Changes

After adding new tables:
1. Write migration to `migrations/NNN_description.sql`
2. Update `src/types/database.ts` with new types
3. Apply: `supabase db push` (if Supabase CLI configured)

## QA / Health Check

- `GET /api/health` returns `{ status: "ok", timestamp: ISO }` — always keep this working
- This endpoint is used by the QA agent to verify deployment

## What NOT to Do

- ❌ Don't import `tailwindcss` in JS/TS files
- ❌ Don't use `process.env` directly — use `src/lib/env.ts`
- ❌ Don't add pages outside `(auth)` or `(dashboard)` unless they're truly public
- ❌ Don't use `npm` or `yarn` — pnpm only
- ❌ Don't put business logic in layout files
