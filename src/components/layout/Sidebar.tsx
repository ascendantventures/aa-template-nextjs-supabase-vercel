"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

// SCAFFOLD: Update NAV_ITEMS with actual app sections
const NAV_ITEMS = [
  { label: "Dashboard", href: "/dashboard", icon: "⬡" },
  { label: "{{NAV_ITEM_2_LABEL}}", href: "/{{NAV_ITEM_2_SLUG}}", icon: "◈" },
  { label: "{{NAV_ITEM_3_LABEL}}", href: "/{{NAV_ITEM_3_SLUG}}", icon: "✦" },
  { label: "{{NAV_ITEM_4_LABEL}}", href: "/{{NAV_ITEM_4_SLUG}}", icon: "◎" },
];

const BOTTOM_NAV = [
  { label: "Settings", href: "/settings", icon: "⚙" },
  { label: "Billing", href: "/billing", icon: "◰" },
];

export function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside style={{
      width: collapsed ? "64px" : "220px",
      minHeight: "100vh",
      background: "#111113",
      borderRight: "1px solid rgba(255,255,255,0.06)",
      display: "flex",
      flexDirection: "column",
      transition: "width 200ms ease",
      flexShrink: 0,
    }}>
      {/* Logo */}
      <div style={{
        padding: collapsed ? "20px 0" : "20px 20px",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        display: "flex",
        alignItems: "center",
        justifyContent: collapsed ? "center" : "space-between",
        height: "60px",
      }}>
        {!collapsed && (
          <span style={{ fontFamily: "var(--font-display, 'Cormorant Garamond', serif)", fontSize: "18px", fontWeight: 600, color: "#FAFAFA" }}>
            {{PRODUCT_NAME}}
          </span>
        )}
        <button
          onClick={() => setCollapsed(c => !c)}
          style={{ background: "none", border: "none", cursor: "pointer", color: "#71717A", padding: "4px", fontSize: "14px" }}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? "→" : "←"}
        </button>
      </div>

      {/* Main nav */}
      <nav style={{ flex: 1, padding: "12px 0" }}>
        {NAV_ITEMS.map(item => {
          const active = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link key={item.href} href={item.href} style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              padding: collapsed ? "10px 0" : "10px 16px",
              justifyContent: collapsed ? "center" : "flex-start",
              textDecoration: "none",
              background: active ? "rgba(255,255,255,0.06)" : "transparent",
              borderLeft: active ? "2px solid #A8A8A8" : "2px solid transparent",
              color: active ? "#FAFAFA" : "#71717A",
              fontSize: "13px",
              fontWeight: active ? 600 : 400,
              transition: "background 150ms, color 150ms",
            }}>
              <span style={{ fontSize: "14px", flexShrink: 0 }}>{item.icon}</span>
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Bottom nav */}
      <div style={{ padding: "12px 0", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        {BOTTOM_NAV.map(item => {
          const active = pathname === item.href;
          return (
            <Link key={item.href} href={item.href} style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              padding: collapsed ? "10px 0" : "10px 16px",
              justifyContent: collapsed ? "center" : "flex-start",
              textDecoration: "none",
              color: active ? "#FAFAFA" : "#71717A",
              fontSize: "13px",
              transition: "color 150ms",
            }}>
              <span style={{ fontSize: "14px", flexShrink: 0 }}>{item.icon}</span>
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </div>
    </aside>
  );
}
