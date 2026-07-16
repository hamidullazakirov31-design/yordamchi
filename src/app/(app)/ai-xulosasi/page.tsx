"use client";

// AI xulosasi — haftalik statistika va xulosa (dizayn: ai-xulosasi.html).

import React from "react";
import { api } from "@/lib/fetcher";
import { Card, EmptyState } from "@/components/ui";

interface XulosaData {
  statistika: { label: string; value: string }[];
  xulosa: string;
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <Card style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
      <span style={{ fontSize: "var(--text-sm)", color: "var(--color-text-muted)", fontWeight: "var(--weight-medium)" }}>{label}</span>
      <span style={{ fontSize: "var(--text-3xl)", fontWeight: "var(--weight-semibold)", lineHeight: "var(--leading-tight)" }}>{value}</span>
    </Card>
  );
}

export default function AiXulosasiPage() {
  const [data, setData] = React.useState<XulosaData | null>(null);
  const [xato, setXato] = React.useState("");

  React.useEffect(() => {
    api
      .get<XulosaData>("/api/analiz/xulosa")
      .then(setData)
      .catch((e) => setXato(e instanceof Error ? e.message : "Yuklab bo'lmadi"));
  }, []);

  if (xato) return <EmptyState text={xato} />;
  if (!data) return <EmptyState text="Yuklanmoqda..." />;

  return (
    <>
      <h1 style={{ margin: 0, fontSize: "var(--text-2xl)", fontWeight: "var(--weight-semibold)" }}>AI xulosasi</h1>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "var(--space-4)" }}>
        {data.statistika.map((s) => (
          <StatCard key={s.label} label={s.label} value={s.value} />
        ))}
      </div>

      <Card style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
        <h2 style={{ margin: 0, fontSize: "var(--text-lg)", fontWeight: "var(--weight-semibold)" }}>Haftalik xulosa</h2>
        <p style={{ margin: 0, fontSize: "var(--text-body)", color: "var(--color-text)", lineHeight: "var(--leading-normal)" }}>
          {data.xulosa}
        </p>
      </Card>
    </>
  );
}
