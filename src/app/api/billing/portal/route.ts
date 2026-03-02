// SCAFFOLD: Stripe customer portal — manage subscriptions and payment methods

import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function GET() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // SCAFFOLD: Uncomment once STRIPE_SECRET_KEY is set
  // const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
  // const portalSession = await stripe.billingPortal.sessions.create({
  //   customer: stripeCustomerId, // SCAFFOLD: Look up customer ID from DB
  //   return_url: `${process.env.NEXT_PUBLIC_APP_URL}/billing`,
  // });
  // return NextResponse.redirect(portalSession.url);

  return NextResponse.json({ error: "Stripe not configured" }, { status: 501 });
}
