// SCAFFOLD: Update with actual settings fields relevant to the product
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export default async function SettingsPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  const user = session?.user;

  return (
    <div style={{ maxWidth: "640px" }}>
      <h1 style={{ fontFamily: "var(--font-display, serif)", fontSize: "28px", fontWeight: 600, color: "#FAFAFA", marginBottom: "8px" }}>
        Settings
      </h1>
      <p style={{ fontSize: "14px", color: "#71717A", marginBottom: "40px" }}>
        Manage your account settings.
      </p>

      {/* Profile section */}
      <section style={{ background: "#111113", borderRadius: "16px", border: "1px solid rgba(255,255,255,0.06)", padding: "24px", marginBottom: "24px" }}>
        <h2 style={{ fontSize: "15px", fontWeight: 600, color: "#FAFAFA", marginBottom: "20px" }}>Profile</h2>

        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {/* SCAFFOLD: Add more profile fields as needed */}
          <div>
            <label style={{ display: "block", fontSize: "12px", fontWeight: 500, color: "#71717A", marginBottom: "6px" }}>Email</label>
            <div style={{ padding: "10px 14px", background: "rgba(255,255,255,0.04)", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.08)", fontSize: "14px", color: "#A8A8A8" }}>
              {user?.email ?? "—"}
            </div>
          </div>
          <div>
            <label style={{ display: "block", fontSize: "12px", fontWeight: 500, color: "#71717A", marginBottom: "6px" }}>Name</label>
            <input
              type="text"
              defaultValue={user?.name ?? ""}
              placeholder="Your name"
              style={{ width: "100%", padding: "10px 14px", background: "rgba(255,255,255,0.05)", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.10)", fontSize: "14px", color: "#FAFAFA", outline: "none", boxSizing: "border-box" }}
            />
          </div>
        </div>
      </section>

      {/* Danger zone */}
      <section style={{ background: "#111113", borderRadius: "16px", border: "1px solid rgba(239,68,68,0.15)", padding: "24px" }}>
        <h2 style={{ fontSize: "15px", fontWeight: 600, color: "#FAFAFA", marginBottom: "8px" }}>Danger zone</h2>
        <p style={{ fontSize: "13px", color: "#71717A", marginBottom: "16px" }}>
          Permanently delete your account and all associated data.
        </p>
        <button style={{
          padding: "8px 16px", borderRadius: "8px", fontSize: "13px", fontWeight: 500,
          background: "transparent", border: "1px solid rgba(239,68,68,0.30)", color: "#EF4444",
          cursor: "pointer",
        }}>
          Delete account
        </button>
      </section>
    </div>
  );
}
