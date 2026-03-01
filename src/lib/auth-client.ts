"use client";

import { createAuthClient } from "better-auth/react";

// BETTER_AUTH_URL is server-only. Use NEXT_PUBLIC_BETTER_AUTH_URL for the
// client, falling back to the current origin so it works on any deployment.
const baseURL =
  process.env.NEXT_PUBLIC_BETTER_AUTH_URL ??
  (typeof window !== "undefined" ? window.location.origin : "");

export const authClient = createAuthClient({
  baseURL,
});

export const {
  signIn,
  signOut,
  signUp,
  useSession,
  getSession,
} = authClient;
