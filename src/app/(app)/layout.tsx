// Ilova qobig'i — chap sidebar + himoyalangan asosiy maydon.
// Sessiya bo'lmasa /login'ga yo'naltiradi (middleware ham himoya qiladi).

import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/session";
import { Sidebar } from "@/components/Sidebar";

export const dynamic = "force-dynamic";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const user = await getSessionUser();
  if (!user) redirect("/login");

  const ism = user.ism || (user.username ? `@${user.username}` : "Foydalanuvchi");

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "var(--color-bg)" }}>
      <Sidebar ism={ism} />
      <main
        style={{
          flex: 1,
          padding: "var(--space-6)",
          display: "flex",
          flexDirection: "column",
          gap: "var(--space-5)",
          maxWidth: "100%",
        }}
      >
        {children}
      </main>
    </div>
  );
}
