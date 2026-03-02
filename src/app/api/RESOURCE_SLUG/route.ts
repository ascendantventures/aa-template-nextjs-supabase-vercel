// SCAFFOLD: Replace RESOURCE_SLUG with your resource name (e.g. "clients", "orders")
// Replace table name in Supabase queries with your actual table

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // SCAFFOLD: Replace "RESOURCE_TABLE" with your Supabase table name
  // Add .eq("user_id", session.user.id) for user-scoped data
  const { data, error } = await supabase
    .from("RESOURCE_TABLE")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(request: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();

  // SCAFFOLD: Add validation (Zod recommended)
  // SCAFFOLD: Replace "RESOURCE_TABLE" with your table name
  const { data, error } = await supabase
    .from("RESOURCE_TABLE")
    .insert({ ...body, user_id: session.user.id })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}
