"use client";

// Chap tomon navigatsiya — barcha ilova sahifalarida umumiy.
// Dizayn ZIP'idagi sidebar.jsx asosida, Next.js routing bilan.

import Link from "next/link";
import { usePathname } from "next/navigation";

type NavItem = {
  href: string;
  label: string;
  icon: React.ReactNode;
};

const NAV_ITEMS: NavItem[] = [
  {
    href: "/goals",
    label: "Maqsadlar",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="9" />
        <circle cx="12" cy="12" r="5" />
        <circle cx="12" cy="12" r="1" />
      </svg>
    ),
  },
  {
    href: "/tasks",
    label: "Vazifalar",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="4" y="4" width="16" height="16" rx="3" />
        <path d="M8 12l2.5 2.5L16 9" />
      </svg>
    ),
  },
  {
    href: "/ai-xulosasi",
    label: "AI xulosasi",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 3v3M12 18v3M3 12h3M18 12h3" />
        <path d="M12 8a4 4 0 1 0 4 4 4 4 0 0 0-4-4Z" />
      </svg>
    ),
  },
  {
    href: "/kun-tahlili",
    label: "Kun tahlili",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 20V10M12 20V4M20 20v-7" />
      </svg>
    ),
  },
  {
    href: "/bot",
    label: "AI bot",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="4" y="8" width="16" height="12" rx="3" />
        <path d="M12 8V4M9 14h.01M15 14h.01" />
      </svg>
    ),
  },
];

export function Sidebar({ ism }: { ism?: string }) {
  const pathname = usePathname();

  return (
    <aside
      style={{
        width: 240,
        flexShrink: 0,
        minHeight: "100vh",
        background: "var(--color-surface)",
        borderRight: "1px solid var(--color-border)",
        display: "flex",
        flexDirection: "column",
        padding: "var(--space-4) var(--space-3)",
        gap: "var(--space-5)",
        position: "sticky",
        top: 0,
      }}
    >
      <div
        style={{
          fontSize: "var(--text-lg)",
          fontWeight: "var(--weight-semibold)",
          color: "var(--color-text)",
          padding: "0 var(--space-2)",
        }}
      >
        Yordamchi
      </div>

      <nav style={{ display: "flex", flexDirection: "column", gap: 4, flex: 1 }}>
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "var(--space-3)",
                padding: "var(--space-2) var(--space-3)",
                borderRadius: "var(--radius-md)",
                textDecoration: "none",
                fontSize: "var(--text-body)",
                fontWeight: isActive ? "var(--weight-semibold)" : "var(--weight-medium)",
                color: isActive ? "var(--color-primary)" : "var(--color-text-muted)",
                background: isActive ? "var(--color-primary-tint)" : "transparent",
                transition: "background 120ms ease, color 120ms ease",
              }}
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)", padding: "0 var(--space-2)" }}>
        {ism && (
          <span style={{ fontSize: "var(--text-xs)", color: "var(--color-text-muted)" }}>
            {ism}
          </span>
        )}
        <form action="/api/auth/logout" method="post">
          <button
            type="submit"
            style={{
              width: "100%",
              padding: "var(--space-2) var(--space-3)",
              borderRadius: "var(--radius-md)",
              border: "1px solid var(--color-border-strong)",
              background: "var(--color-surface)",
              color: "var(--color-text-muted)",
              fontFamily: "var(--font-family-base)",
              fontSize: "var(--text-sm)",
              fontWeight: "var(--weight-medium)",
              cursor: "pointer",
            }}
          >
            Chiqish
          </button>
        </form>
      </div>
    </aside>
  );
}
