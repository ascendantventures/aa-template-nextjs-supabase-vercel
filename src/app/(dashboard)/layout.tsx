import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { Sidebar } from "@/components/layout/Sidebar";
import { TopBar } from "@/components/layout/TopBar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/login");

  const user = session.user;

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#09090B" }}>
      <Sidebar />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        <TopBar userName={user?.name ?? user?.email?.split("@")[0] ?? "User"} userEmail={user?.email ?? ""} />
        <main style={{ flex: 1, padding: "32px 24px", overflow: "auto" }}>
          {children}
        </main>
      </div>
    </div>
  );
}
