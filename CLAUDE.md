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

---

## SaaS Extensions

### Sidebar
`src/components/layout/Sidebar.tsx` — update `NAV_ITEMS` array with your app's sections.
Replace `{{NAV_ITEM_X_LABEL}}` and `{{NAV_ITEM_X_SLUG}}` tokens.

### Settings
`src/app/(dashboard)/settings/page.tsx` — add real form fields with server actions.
The "Delete account" button needs a server action wired to Better Auth + Supabase.

### Billing
`src/app/(dashboard)/billing/page.tsx` — replace `PLANS` array with real pricing.

**Stripe integration pattern:**
```ts
import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
```

API routes are pre-stubbed with comments showing exact implementation steps:
- `/api/billing/checkout` — creates checkout session
- `/api/billing/portal` — Stripe customer portal redirect
- `/api/billing/webhook` — handles subscription lifecycle events

**PATTERN 23 applies**: ship with Stripe stubs for MVP. Real keys go in Vercel env vars post-deploy.

### Critical rules for SaaS apps
- Never store subscription state only in Stripe — mirror to a `subscriptions` table in Supabase
- Webhook handler must be idempotent (Stripe can retry events)
- `NEXT_PUBLIC_APP_URL` must be set for redirect URLs to work

---

## Internal Tool Extensions

### DataTable component
`src/components/data/DataTable.tsx` — generic, typed. Pass `columns` and `data`. The `render` prop lets you customize any cell (badges, links, etc.).

### CrudModal component
`src/components/forms/CrudModal.tsx` — drives create and edit flows from the same `FieldDef[]` array. Supports text, email, number, textarea, select.

### CSV export
`src/lib/export-csv.ts` — client-side only (uses `Blob + URL.createObjectURL`). Import and call `exportCsv(data, columns, filename)` from a button click handler.

### Adding a new resource
Duplicate `RESOURCE_SLUG/` directory, rename it, update:
1. `TRow` interface — match your Supabase table schema
2. `COLUMNS` — drives table headers + cell rendering
3. `FIELDS` — drives modal form inputs
4. API routes — replace `RESOURCE_TABLE` with Supabase table name
5. Add nav entry in `Sidebar.tsx`
6. Write migration in `migrations/`

### CRUD patterns
- Always enforce `user_id = session.user.id` in PATCH/DELETE — prevents cross-user data access
- GET can skip `user_id` filter if data is org-scoped (adjust as needed)
- Add Zod validation on POST/PATCH before hitting Supabase
- Return `204 No Content` on successful DELETE (not 200)

## Vercel Deploy Configuration
- **Do NOT add `output: "export"` to next.config** unless the spec explicitly requires a static site with no server-side features
- The app deploys to Vercel with SSR — static export breaks API routes, middleware, and Server Components
- For static pages, use `generateStaticParams()` instead of `output: "export"`
- Vercel will fail with NEXT_NO_ROUTES_MANIFEST if static export is used with the nextjs framework preset

