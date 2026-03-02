/**
 * Zod env schema — validates all required env vars at startup.
 * SCAFFOLD: Add vars your app needs. Remove vars your app doesn't use.
 * Import this at the top of any file that needs env vars instead of
 * accessing process.env directly.
 */

import { z } from "zod";

const server = z.object({
  // Supabase
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),

  // Better Auth
  BETTER_AUTH_SECRET: z.string().min(32),
  BETTER_AUTH_URL: z.string().url(),

  // SCAFFOLD: Add server-side env vars below
  // DATABASE_URL: z.string().url(),
  // STRIPE_SECRET_KEY: z.string().startsWith("sk_").optional(),
  // STRIPE_WEBHOOK_SECRET: z.string().optional(),
  // RESEND_API_KEY: z.string().optional(),
});

const client = z.object({
  // Supabase
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),

  // Better Auth
  NEXT_PUBLIC_BETTER_AUTH_URL: z.string().url(),

  // App
  NEXT_PUBLIC_APP_URL: z.string().url().optional(),

  // SCAFFOLD: Add NEXT_PUBLIC_ vars below
  // NEXT_PUBLIC_POSTHOG_KEY: z.string().optional(),
});

function createEnv() {
  // Skip validation in test environments or when building
  if (process.env.SKIP_ENV_VALIDATION === "1") {
    return { ...process.env } as ReturnType<typeof parseEnv>;
  }
  return parseEnv();
}

function parseEnv() {
  // Server-side: validate all vars
  if (typeof window === "undefined") {
    const parsed = server.safeParse(process.env);
    if (!parsed.success) {
      console.error("❌ Invalid server environment variables:");
      console.error(parsed.error.flatten().fieldErrors);
      throw new Error("Invalid server environment variables. Check your .env file.");
    }
    const clientParsed = client.safeParse(process.env);
    if (!clientParsed.success) {
      console.error("❌ Invalid client environment variables:");
      console.error(clientParsed.error.flatten().fieldErrors);
      throw new Error("Invalid client environment variables.");
    }
    return { ...parsed.data, ...clientParsed.data };
  }

  // Client-side: only validate NEXT_PUBLIC_ vars
  const clientParsed = client.safeParse({
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    NEXT_PUBLIC_BETTER_AUTH_URL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  });
  if (!clientParsed.success) {
    console.error("❌ Invalid client environment variables:", clientParsed.error.flatten().fieldErrors);
  }
  return clientParsed.data ?? ({} as z.infer<typeof client>);
}

export const env = createEnv();
export type Env = ReturnType<typeof createEnv>;
