"use client";

// Maqsadlar sahifasi — CRUD (dizayn: index.html).

import React from "react";
import { api, formatDate, toDateInput } from "@/lib/fetcher";
import type { GoalDTO } from "@/lib/types";
import {
  Card,
  Button,
  Input,
  Textarea,
  ProgressBar,
  StatusTag,
  Modal,
  RowMenu,
  EmptyState,
} from "@/components/ui";

type FormState = { sarlavha: string; tavsif: string; muddat: string };

function GoalFormModal({
  initial,
  onClose,
  onSaved,
}: {
  initial: GoalDTO | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [form, setForm] = React.useState<FormState>({
    sarlavha: initial?.sarlavha ?? "",
    tavsif: initial?.tavsif ?? "",
    muddat: toDateInput(initial?.muddat ?? null),
  });
  const [error, setError] = React.useState("");
  const [saqlanmoqda, setSaqlanmoqda] = React.useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.sarlavha.trim()) {
      setError("Sarlavha kiritilishi shart");
      return;
    }
    setSaqlanmoqda(true);
    try {
      const body = {
        sarlavha: form.sarlavha.trim(),
        tavsif: form.tavsif.trim() || null,
        muddat: form.muddat || null,
      };
      if (initial) await api.patch(`/api/goals/${initial.id}`, body);
      else await api.post("/api/goals", body);
      onSaved();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Xatolik");
      setSaqlanmoqda(false);
    }
  }

  return (
    <Modal onClose={onClose}>
      <h2 style={{ margin: 0, fontSize: "var(--text-lg)", fontWeight: "var(--weight-semibold)" }}>
        {initial ? "Maqsadni tahrirlash" : "Yangi maqsad qo'shish"}
      </h2>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
        <Input
          label="Sarlavha"
          placeholder="Masalan: Ingliz tilini o'rganish"
          value={form.sarlavha}
          onChange={(e) => {
            setForm({ ...form, sarlavha: e.target.value });
            setError("");
          }}
          error={error}
        />
        <Textarea
          label="Tavsif"
          placeholder="Qisqacha tavsif"
          value={form.tavsif}
          onChange={(e) => setForm({ ...form, tavsif: e.target.value })}
        />
        <Input
          label="Muddat"
          type="date"
          value={form.muddat}
          onChange={(e) => setForm({ ...form, muddat: e.target.value })}
        />
        <p style={{ margin: 0, fontSize: "var(--text-xs)", color: "var(--color-text-muted)" }}>
          Progress va holat vazifalar bajarilishidan avtomatik hisoblanadi.
        </p>
        <div style={{ display: "flex", justifyContent: "flex-end", gap: "var(--space-2)", marginTop: "var(--space-2)" }}>
          <Button type="button" variant="secondary" onClick={onClose}>
            Bekor qilish
          </Button>
          <Button type="submit" variant="primary" disabled={saqlanmoqda}>
            {initial ? "Saqlash" : "Qo'shish"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

function GoalCard({
  goal,
  onEdit,
  onDelete,
}: {
  goal: GoalDTO;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <Card style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "var(--space-2)" }}>
        <h3 style={{ margin: 0, fontSize: "var(--text-md)", fontWeight: "var(--weight-semibold)", lineHeight: "var(--leading-tight)" }}>
          {goal.sarlavha}
        </h3>
        <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)" }}>
          <StatusTag status={goal.bajarilgan ? "done" : "pending"}>
            {goal.bajarilgan ? "Bajarilgan" : "Faol"}
          </StatusTag>
          <RowMenu onEdit={onEdit} onDelete={onDelete} />
        </div>
      </div>

      <p style={{ margin: 0, fontSize: "var(--text-body)", color: "var(--color-text-muted)", lineHeight: "var(--leading-normal)" }}>
        {goal.tavsif || "Tavsif kiritilmagan."}
      </p>

      <div style={{ fontSize: "var(--text-sm)", color: "var(--color-text-muted)", display: "flex", gap: "var(--space-3)" }}>
        <span>Muddat: {formatDate(goal.muddat)}</span>
        <span>· {goal.bajarilganSoni}/{goal.vazifalarSoni} vazifa</span>
      </div>

      <ProgressBar value={goal.progress} label="Bajarilishi" />
    </Card>
  );
}

export default function GoalsPage() {
  const [goals, setGoals] = React.useState<GoalDTO[] | null>(null);
  const [xato, setXato] = React.useState("");
  const [modal, setModal] = React.useState<{ mode: "create" } | { mode: "edit"; goal: GoalDTO } | null>(null);

  const load = React.useCallback(async () => {
    try {
      const data = await api.get<{ maqsadlar: GoalDTO[] }>("/api/goals");
      setGoals(data.maqsadlar);
    } catch (e) {
      setXato(e instanceof Error ? e.message : "Yuklab bo'lmadi");
    }
  }, []);

  React.useEffect(() => {
    load();
  }, [load]);

  async function handleDelete(goal: GoalDTO) {
    if (!confirm(`"${goal.sarlavha}" maqsadi o'chirilsinmi? Unga bog'langan vazifalar ham o'chadi.`)) return;
    await api.del(`/api/goals/${goal.id}`);
    load();
  }

  return (
    <>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "var(--space-3)", flexWrap: "wrap" }}>
        <h1 style={{ margin: 0, fontSize: "var(--text-2xl)", fontWeight: "var(--weight-semibold)" }}>Maqsadlar</h1>
        <Button variant="primary" onClick={() => setModal({ mode: "create" })} style={{ whiteSpace: "nowrap" }}>
          + Yangi maqsad qo&apos;shish
        </Button>
      </div>

      {xato && <EmptyState text={xato} />}

      {goals === null && !xato && <EmptyState text="Yuklanmoqda..." />}

      {goals !== null && goals.length === 0 && (
        <EmptyState text="Hali maqsad yo'q. Birinchi maqsadingizni qo'shing." />
      )}

      {goals !== null && goals.length > 0 && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "var(--space-4)" }}>
          {goals.map((goal) => (
            <GoalCard
              key={goal.id}
              goal={goal}
              onEdit={() => setModal({ mode: "edit", goal })}
              onDelete={() => handleDelete(goal)}
            />
          ))}
        </div>
      )}

      {modal && (
        <GoalFormModal
          initial={modal.mode === "edit" ? modal.goal : null}
          onClose={() => setModal(null)}
          onSaved={() => {
            setModal(null);
            load();
          }}
        />
      )}
    </>
  );
}
