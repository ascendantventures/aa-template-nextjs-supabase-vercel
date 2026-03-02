// SCAFFOLD: Wire up Stripe. Add STRIPE_SECRET_KEY + STRIPE_WEBHOOK_SECRET to env.
// Replace PLANS with actual price IDs from your Stripe dashboard.
// See CLAUDE.md for Stripe integration patterns.

// SCAFFOLD: Update PLANS with real pricing and Stripe price IDs
const PLANS = [
  {
    name: "{{PLAN_1_NAME}}",
    price: "{{PLAN_1_PRICE}}",
    period: "per month",
    description: "{{PLAN_1_DESCRIPTION}}",
    features: ["{{PLAN_1_FEATURE_1}}", "{{PLAN_1_FEATURE_2}}", "{{PLAN_1_FEATURE_3}}"],
    stripePriceId: "price_XXXX", // SCAFFOLD: Replace with real Stripe price ID
    current: true, // SCAFFOLD: Determine from subscription status
  },
  {
    name: "{{PLAN_2_NAME}}",
    price: "{{PLAN_2_PRICE}}",
    period: "per month",
    description: "{{PLAN_2_DESCRIPTION}}",
    features: ["{{PLAN_2_FEATURE_1}}", "{{PLAN_2_FEATURE_2}}", "{{PLAN_2_FEATURE_3}}", "{{PLAN_2_FEATURE_4}}"],
    stripePriceId: "price_YYYY", // SCAFFOLD: Replace with real Stripe price ID
    current: false,
  },
];

export default function BillingPage() {
  return (
    <div style={{ maxWidth: "800px" }}>
      <h1 style={{ fontFamily: "var(--font-display, serif)", fontSize: "28px", fontWeight: 600, color: "#FAFAFA", marginBottom: "8px" }}>
        Billing
      </h1>
      <p style={{ fontSize: "14px", color: "#71717A", marginBottom: "40px" }}>
        Manage your plan and payment details.
      </p>

      {/* Current subscription */}
      <section style={{ background: "#111113", borderRadius: "16px", border: "1px solid rgba(255,255,255,0.06)", padding: "24px", marginBottom: "32px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <h2 style={{ fontSize: "15px", fontWeight: 600, color: "#FAFAFA" }}>Current plan</h2>
          {/* SCAFFOLD: Add Stripe customer portal link */}
          <a href="/api/billing/portal" style={{
            fontSize: "12px", color: "#71717A", textDecoration: "none", padding: "6px 12px",
            border: "1px solid rgba(255,255,255,0.10)", borderRadius: "6px",
          }}>
            Manage payment
          </a>
        </div>

        {/* SCAFFOLD: Replace with actual subscription data from Stripe */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{ padding: "4px 10px", borderRadius: "9999px", background: "rgba(168,168,168,0.1)", border: "1px solid rgba(168,168,168,0.2)" }}>
            <span style={{ fontSize: "11px", color: "#A8A8A8", fontWeight: 600 }}>FREE TIER</span>
          </div>
          <span style={{ fontSize: "13px", color: "#71717A" }}>Upgrade to unlock more features</span>
        </div>
      </section>

      {/* Plan cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "16px" }}>
        {PLANS.map((plan, i) => (
          <div key={i} style={{
            padding: "28px 24px",
            borderRadius: "16px",
            background: "#111113",
            border: plan.current ? "2px solid #A8A8A8" : "1px solid rgba(255,255,255,0.08)",
          }}>
            {plan.current && (
              <div style={{ marginBottom: "12px" }}>
                <span style={{
                  fontSize: "10px", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase",
                  color: "#A8A8A8", background: "rgba(168,168,168,0.1)", padding: "3px 8px", borderRadius: "9999px",
                }}>
                  Current plan
                </span>
              </div>
            )}
            <h3 style={{ fontSize: "16px", fontWeight: 600, color: "#FAFAFA", marginBottom: "4px" }}>{plan.name}</h3>
            <p style={{ fontSize: "12px", color: "#71717A", marginBottom: "20px" }}>{plan.description}</p>
            <div style={{ marginBottom: "20px" }}>
              <span style={{ fontFamily: "var(--font-display, serif)", fontSize: "40px", fontWeight: 700, color: "#FAFAFA" }}>{plan.price}</span>
              <span style={{ fontSize: "13px", color: "#71717A", marginLeft: "4px" }}>{plan.period}</span>
            </div>
            <ul style={{ listStyle: "none", padding: 0, margin: "0 0 24px", display: "flex", flexDirection: "column", gap: "8px" }}>
              {plan.features.map((f, j) => (
                <li key={j} style={{ display: "flex", gap: "8px", fontSize: "13px", color: "#A1A1AA" }}>
                  <span style={{ color: "#A8A8A8" }}>✓</span>{f}
                </li>
              ))}
            </ul>
            {/* SCAFFOLD: Wire to Stripe Checkout via /api/billing/checkout */}
            <a
              href={plan.current ? "/api/billing/portal" : `/api/billing/checkout?priceId=${plan.stripePriceId}`}
              style={{
                display: "block", width: "100%", padding: "10px",
                borderRadius: "9999px", textAlign: "center",
                fontSize: "13px", fontWeight: 600, textDecoration: "none",
                ...(plan.current
                  ? { background: "#18181B", color: "#71717A", border: "1px solid rgba(255,255,255,0.08)", cursor: "default" }
                  : { background: "#FFFFFF", color: "#09090B" }),
                boxSizing: "border-box",
              }}
            >
              {plan.current ? "Current plan" : "Upgrade"}
            </a>
          </div>
        ))}
      </div>

      {/* SCAFFOLD: Add invoice history table once Stripe is wired */}
    </div>
  );
}
