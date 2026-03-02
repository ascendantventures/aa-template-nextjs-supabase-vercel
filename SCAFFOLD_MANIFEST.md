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

---

## SaaS Extensions (added by feat/saas-extensions)

### Sidebar nav
File: `src/components/layout/Sidebar.tsx`

| Token | Description |
|---|---|
| `{{PRODUCT_NAME}}` | App name in sidebar logo |
| `{{NAV_ITEM_2_LABEL}}` through `{{NAV_ITEM_4_LABEL}}` | Nav section labels |
| `{{NAV_ITEM_2_SLUG}}` through `{{NAV_ITEM_4_SLUG}}` | URL slugs (e.g. `clients`, `projects`) |

### Billing page
File: `src/app/(dashboard)/billing/page.tsx`

| Token | Description |
|---|---|
| `{{PLAN_1_NAME}}` / `{{PLAN_2_NAME}}` | Plan tier names |
| `{{PLAN_1_PRICE}}` / `{{PLAN_2_PRICE}}` | Price strings (e.g. `$29`) |
| `{{PLAN_X_DESCRIPTION}}` | One-line plan description |
| `{{PLAN_X_FEATURE_Y}}` | Feature list items |

After replacing tokens: update `stripePriceId` fields with real Stripe price IDs.

### Stripe setup
1. Add env vars: `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `NEXT_PUBLIC_APP_URL`
2. Uncomment Stripe code in `/api/billing/checkout/route.ts` and `/api/billing/portal/route.ts`
3. Register webhook URL in Stripe dashboard → Webhooks → Add endpoint: `https://your-domain.com/api/billing/webhook`
4. Enable events: `customer.subscription.created`, `customer.subscription.updated`, `customer.subscription.deleted`

---

## Internal Tool Extensions (added by feat/internal-tool-extensions)

### Resource page
Directory: `src/app/(dashboard)/RESOURCE_SLUG/`

| Token | Description |
|---|---|
| `RESOURCE_SLUG` | URL slug + directory name (e.g. `clients`, `orders`) |
| `RESOURCE_NAME_PLURAL` | Display name plural (e.g. "Clients") |
| `RESOURCE_NAME_SINGULAR` | Display name singular (e.g. "Client") |
| `RESOURCE_TABLE` | Supabase table name |

### Shared components
- `src/components/data/DataTable.tsx` — sortable, searchable, paginated table (generic)
- `src/components/forms/CrudModal.tsx` — create/edit modal with field definitions
- `src/lib/export-csv.ts` — client-side CSV export

### After scaffolding
1. Rename `RESOURCE_SLUG/` directory to your resource name
2. Replace `TRow` interface with your actual data shape
3. Update `COLUMNS` and `FIELDS` arrays in the page component
4. Update `RESOURCE_TABLE` in API route files
5. Add nav entry in `Sidebar.tsx` `NAV_ITEMS`
6. Create Supabase migration for your table (see `migrations/` directory)
