// SCAFFOLD: Stripe checkout — create a checkout session for plan upgrades
// Requires: STRIPE_SECRET_KEY in .env
// Replace with real price IDs from your Stripe dashboard

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function GET(request: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const priceId = request.nextUrl.searchParams.get("priceId");
  if (!priceId) return NextResponse.json({ error: "Missing priceId" }, { status: 400 });

  // SCAFFOLD: Uncomment and implement once STRIPE_SECRET_KEY is set
  // const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
  // const checkoutSession = await stripe.checkout.sessions.create({
  //   customer_email: session.user.email!,
  //   line_items: [{ price: priceId, quantity: 1 }],
  //   mode: "subscription",
  //   success_url: `${process.env.NEXT_PUBLIC_APP_URL}/billing?success=true`,
  //   cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/billing`,
  // });
  // return NextResponse.redirect(checkoutSession.url!);

  return NextResponse.json({ error: "Stripe not configured" }, { status: 501 });
}
