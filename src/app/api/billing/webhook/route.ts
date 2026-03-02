// SCAFFOLD: Stripe webhook — handle subscription events
// Register endpoint in Stripe dashboard: https://dashboard.stripe.com/webhooks
// Required events: customer.subscription.created, updated, deleted
// Requires: STRIPE_WEBHOOK_SECRET in .env

import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const body = await request.text();
  const sig = request.headers.get("stripe-signature");

  if (!sig) return NextResponse.json({ error: "Missing signature" }, { status: 400 });

  // SCAFFOLD: Uncomment once STRIPE_SECRET_KEY + STRIPE_WEBHOOK_SECRET are set
  // const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
  // const event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  //
  // switch (event.type) {
  //   case "customer.subscription.created":
  //   case "customer.subscription.updated":
  //     // Update subscription status in DB
  //     break;
  //   case "customer.subscription.deleted":
  //     // Downgrade user to free tier
  //     break;
  // }

  return NextResponse.json({ received: true });
}
