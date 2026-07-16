"use client";

// Kun tahlili — bugungi vazifalar holati + tavsiyalar (dizayn: kun-tahlili.html).

import React from "react";
import { api } from "@/lib/fetcher";
import { Card, EmptyState } from "@/components/ui";

interface KunData {
  sana: string;
  xulosa: string;
  bajarilgan: { id: string; sarlavha: string; maqsad: string }[];
  bajarilmagan: { id: string; sarlavha: string; maqsad: string }[];
  tavsiyalar: string[];
}

function TaskListItem({ sarlavha, maqsad, dotColor }: { sarlavha: string; maqsad: string; dotColor: string }) {
  return (
    <div style={{ display: "flex", alignItems: "flex-start", gap: "var(--space-3)" }}>
      <span style={{ width: 8, height: 8, borderRadius: "50%", background: dotColor, marginTop: 6, flexShrink: 0 }} />
      <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <span style={{ fontSize: "var(--text-body)", color: "var(--color-text)", fontWeight: "var(--weight-medium)" }}>
          {sarlavha}
        </span>
        <span style={{ fontSize: "var(--text-xs)", color: "var(--color-text-muted)" }}>{maqsad}</span>
      </div>
    </div>
  );
}

function ListCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Card style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
      <h2 style={{ margin: 0, fontSize: "var(--text-md)", fontWeight: "var(--weight-semibold)" }}>{title}</h2>
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>{children}</div>
    </Card>
  );
}

export default function KunTahliliPage() {
  const [data, setData] = React.useState<KunData | null>(null);
  const [xato, setXato] = React.useState("");

  React.useEffect(() => {
    api
      .get<KunData>("/api/analiz/kun")
      .then(setData)
      .catch((e) => setXato(e instanceof Error ? e.message : "Yuklab bo'lmadi"));
  }, []);

  const bugunLabel = new Date().toLocaleDateString("uz-UZ", { day: "numeric", month: "long", year: "numeric" });

  if (xato) return <EmptyState text={xato} />;
  if (!data) return <EmptyState text="Yuklanmoqda..." />;

  const bosh = "var(--color-text-muted)";

  return (
    <>
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-1)" }}>
        <span style={{ fontSize: "var(--text-sm)", color: bosh, fontWeight: "var(--weight-medium)" }}>{bugunLabel}</span>
        <h1 style={{ margin: 0, fontSize: "var(--text-2xl)", fontWeight: "var(--weight-semibold)" }}>Kun tahlili</h1>
        <p style={{ margin: 0, marginTop: "var(--space-1)", fontSize: "var(--text-body)", color: bosh, lineHeight: "var(--leading-normal)" }}>
          {data.xulosa}
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "var(--space-4)" }}>
        <ListCard title="Bugun bajarilgan">
          {data.bajarilgan.length === 0 ? (
            <span style={{ fontSize: "var(--text-sm)", color: bosh }}>Hali yo&apos;q</span>
          ) : (
            data.bajarilgan.map((t) => <TaskListItem key={t.id} sarlavha={t.sarlavha} maqsad={t.maqsad} dotColor="var(--color-success)" />)
          )}
        </ListCard>

        <ListCard title="Bajarilmagan">
          {data.bajarilmagan.length === 0 ? (
            <span style={{ fontSize: "var(--text-sm)", color: bosh }}>Barchasi bajarildi 🎉</span>
          ) : (
            data.bajarilmagan.map((t) => <TaskListItem key={t.id} sarlavha={t.sarlavha} maqsad={t.maqsad} dotColor="var(--color-pending)" />)
          )}
        </ListCard>

        <ListCard title="Ertaga uchun tavsiya">
          {data.tavsiyalar.map((r, i) => (
            <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "var(--space-3)" }}>
              <span
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 20,
                  height: 20,
                  borderRadius: "50%",
                  background: "var(--color-primary-tint)",
                  color: "var(--color-primary)",
                  fontSize: "var(--text-xs)",
                  fontWeight: "var(--weight-semibold)",
                  flexShrink: 0,
                  marginTop: 1,
                }}
              >
                {i + 1}
              </span>
              <span style={{ fontSize: "var(--text-body)", color: "var(--color-text)", lineHeight: "var(--leading-normal)" }}>{r}</span>
            </div>
          ))}
        </ListCard>
      </div>
    </>
  );
}
