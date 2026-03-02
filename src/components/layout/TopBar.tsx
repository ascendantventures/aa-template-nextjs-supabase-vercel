"use client";

import { useState } from "react";

// SCAFFOLD: Update with actual user data from session
interface TopBarProps {
  userName?: string;
  userEmail?: string;
}

export function TopBar({ userName = "User", userEmail = "" }: TopBarProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header style={{
      height: "60px",
      borderBottom: "1px solid rgba(255,255,255,0.06)",
      background: "#09090B",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "0 24px",
      position: "sticky",
      top: 0,
      zIndex: 20,
    }}>
      {/* Page title slot — filled by child pages */}
      <div id="topbar-title" style={{ fontSize: "14px", fontWeight: 600, color: "#FAFAFA" }} />

      {/* User menu */}
      <div style={{ position: "relative" }}>
        <button
          data-testid="user-menu-button"
          onClick={() => setMenuOpen(m => !m)}
          style={{
            display: "flex", alignItems: "center", gap: "8px",
            background: "none", border: "none", cursor: "pointer",
            padding: "4px 8px", borderRadius: "8px",
          }}
        >
          <div style={{
            width: "32px", height: "32px", borderRadius: "50%",
            background: "rgba(168,168,168,0.15)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "13px", fontWeight: 600, color: "#A8A8A8",
          }}>
            {userName.charAt(0).toUpperCase()}
          </div>
          <span style={{ fontSize: "13px", color: "#A8A8A8" }}>{userName}</span>
        </button>

        {menuOpen && (
          <div style={{
            position: "absolute", right: 0, top: "calc(100% + 8px)",
            background: "#18181B", border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: "12px", padding: "8px", minWidth: "200px",
            boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
          }}>
            <div style={{ padding: "8px 12px 12px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
              <p style={{ fontSize: "13px", fontWeight: 600, color: "#FAFAFA", margin: 0 }}>{userName}</p>
              <p style={{ fontSize: "11px", color: "#71717A", margin: "2px 0 0" }}>{userEmail}</p>
            </div>
            <a href="/settings" style={{ display: "block", padding: "10px 12px", fontSize: "13px", color: "#A8A8A8", textDecoration: "none", borderRadius: "6px" }}>
              Settings
            </a>
            <a href="/billing" style={{ display: "block", padding: "10px 12px", fontSize: "13px", color: "#A8A8A8", textDecoration: "none", borderRadius: "6px" }}>
              Billing
            </a>
            <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", marginTop: "4px", paddingTop: "4px" }}>
              <a
                data-testid="logout-button"
                href="/auth/sign-out"
                style={{ display: "block", padding: "10px 12px", fontSize: "13px", color: "#71717A", textDecoration: "none", borderRadius: "6px" }}
              >
                Sign out
              </a>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
