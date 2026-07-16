"use client";

// Vazifalar sahifasi — CRUD + "bajarildi" belgilash (dizayn: vazifalar.html).

import React from "react";
import { api, formatDate, toDateInput } from "@/lib/fetcher";
import type { GoalDTO, TaskDTO } from "@/lib/types";
import { Card, Button, Input, Modal, PriorityTag, RowMenu, EmptyState } from "@/components/ui";

const MUHIMLIK_OPTIONS = [
  { key: 3, label: "Yuqori" },
  { key: 2, label: "O'rta" },
  { key: 1, label: "Past" },
];

type FormState = { sarlavha: string; goalId: string; muddat: string; muhimlik: number };

function TaskFormModal({
  initial,
  goals,
  onClose,
  onSaved,
}: {
  initial: TaskDTO | null;
  goals: GoalDTO[];
  onClose: () => void;
  onSaved: () => void;
}) {
  const [form, setForm] = React.useState<FormState>({
    sarlavha: initial?.sarlavha ?? "",
    goalId: initial?.goalId ?? "",
    muddat: toDateInput(initial?.muddat ?? null),
    muhimlik: initial?.muhimlik ?? 2,
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
        goalId: form.goalId || null,
        muddat: form.muddat || null,
        muhimlik: form.muhimlik,
      };
      if (initial) await api.patch(`/api/tasks/${initial.id}`, body);
      else await api.post("/api/tasks", body);
      onSaved();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Xatolik");
      setSaqlanmoqda(false);
    }
  }

  return (
    <Modal onClose={onClose}>
      <h2 style={{ margin: 0, fontSize: "var(--text-lg)", fontWeight: "var(--weight-semibold)" }}>
        {initial ? "Vazifani tahrirlash" : "Yangi vazifa"}
      </h2>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
        <Input
          label="Sarlavha"
          placeholder="Masalan: 30 daqiqa yugurish"
          value={form.sarlavha}
          onChange={(e) => {
            setForm({ ...form, sarlavha: e.target.value });
            setError("");
          }}
          error={error}
        />

        <label style={{ display: "flex", flexDirection: "column", gap: "var(--space-1)" }}>
          <span style={{ fontSize: "var(--text-sm)", fontWeight: "var(--weight-medium)" }}>Bog&apos;langan maqsad</span>
          <select
            value={form.goalId}
            onChange={(e) => setForm({ ...form, goalId: e.target.value })}
            style={{
              padding: "var(--space-2) var(--space-3)",
              borderRadius: "var(--radius-md)",
              border: "1px solid var(--color-border-strong)",
              fontFamily: "var(--font-family-base)",
              fontSize: "var(--text-body)",
              color: "var(--color-text)",
              background: "var(--color-surface)",
            }}
          >
            <option value="">Bog&apos;lanmagan</option>
            {goals.map((g) => (
              <option key={g.id} value={g.id}>
                {g.sarlavha}
              </option>
            ))}
          </select>
        </label>

        <Input
          label="Muddat"
          type="date"
          value={form.muddat}
          onChange={(e) => setForm({ ...form, muddat: e.target.value })}
        />

        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-1)" }}>
          <span style={{ fontSize: "var(--text-sm)", fontWeight: "var(--weight-medium)" }}>Muhimlik</span>
          <div style={{ display: "flex", gap: "var(--space-2)" }}>
            {MUHIMLIK_OPTIONS.map((opt) => (
              <Button
                key={opt.key}
                type="button"
                variant={form.muhimlik === opt.key ? "primary" : "secondary"}
                onClick={() => setForm({ ...form, muhimlik: opt.key })}
                style={{ flex: 1 }}
              >
                {opt.label}
              </Button>
            ))}
          </div>
        </div>

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

function TaskRow({
  task,
  onToggle,
  onEdit,
  onDelete,
}: {
  task: TaskDTO;
  onToggle: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const done = task.bajarildi;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)", padding: "var(--space-3) var(--space-4)" }}>
      <input
        type="checkbox"
        checked={done}
        onChange={onToggle}
        style={{ width: 18, height: 18, flexShrink: 0, accentColor: "var(--color-primary)", cursor: "pointer" }}
      />
      <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 4 }}>
        <span
          style={{
            fontSize: "var(--text-body)",
            fontWeight: "var(--weight-medium)",
            color: done ? "var(--color-text-muted)" : "var(--color-text)",
            textDecoration: done ? "line-through" : "none",
          }}
        >
          {task.sarlavha}
        </span>
        <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)", flexWrap: "wrap" }}>
          {task.goalSarlavha && (
            <span
              style={{
                fontSize: "var(--text-xs)",
                fontWeight: "var(--weight-medium)",
                color: "var(--color-primary)",
                background: "var(--color-primary-tint)",
                borderRadius: "var(--radius-pill)",
                padding: "2px var(--space-2)",
              }}
            >
              {task.goalSarlavha}
            </span>
          )}
          <span style={{ fontSize: "var(--text-xs)", color: "var(--color-text-muted)" }}>{formatDate(task.muddat)}</span>
        </div>
      </div>
      <PriorityTag muhimlik={task.muhimlik} />
      <RowMenu onEdit={onEdit} onDelete={onDelete} />
    </div>
  );
}

function TaskSection({
  title,
  tasks,
  onToggle,
  onEdit,
  onDelete,
}: {
  title: string;
  tasks: TaskDTO[];
  onToggle: (t: TaskDTO) => void;
  onEdit: (t: TaskDTO) => void;
  onDelete: (t: TaskDTO) => void;
}) {
  if (tasks.length === 0) return null;
  return (
    <section style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
      <h2 style={{ margin: 0, fontSize: "var(--text-lg)", fontWeight: "var(--weight-semibold)" }}>{title}</h2>
      <Card style={{ padding: 0 }}>
        {tasks.map((task, i) => (
          <div key={task.id} style={{ borderTop: i === 0 ? "none" : "1px solid var(--color-border)" }}>
            <TaskRow
              task={task}
              onToggle={() => onToggle(task)}
              onEdit={() => onEdit(task)}
              onDelete={() => onDelete(task)}
            />
          </div>
        ))}
      </Card>
    </section>
  );
}

// Muddat asosida bo'lim: bugun/o'tgan/muddatsiz → "Bugun"; kelajak → "Kelgusi".
function isKelgusi(iso: string | null): boolean {
  if (!iso) return false;
  const d = new Date(iso);
  const bugun = new Date();
  bugun.setHours(23, 59, 59, 999);
  return d.getTime() > bugun.getTime();
}

export default function TasksPage() {
  const [tasks, setTasks] = React.useState<TaskDTO[] | null>(null);
  const [goals, setGoals] = React.useState<GoalDTO[]>([]);
  const [xato, setXato] = React.useState("");
  const [modal, setModal] = React.useState<{ mode: "create" } | { mode: "edit"; task: TaskDTO } | null>(null);

  const load = React.useCallback(async () => {
    try {
      const [t, g] = await Promise.all([
        api.get<{ vazifalar: TaskDTO[] }>("/api/tasks"),
        api.get<{ maqsadlar: GoalDTO[] }>("/api/goals"),
      ]);
      setTasks(t.vazifalar);
      setGoals(g.maqsadlar);
    } catch (e) {
      setXato(e instanceof Error ? e.message : "Yuklab bo'lmadi");
    }
  }, []);

  React.useEffect(() => {
    load();
  }, [load]);

  async function handleToggle(task: TaskDTO) {
    // Optimistik yangilash
    setTasks((prev) => prev?.map((t) => (t.id === task.id ? { ...t, bajarildi: !t.bajarildi } : t)) ?? prev);
    try {
      await api.patch(`/api/tasks/${task.id}`, { bajarildi: !task.bajarildi });
    } finally {
      load();
    }
  }

  async function handleDelete(task: TaskDTO) {
    if (!confirm(`"${task.sarlavha}" vazifasi o'chirilsinmi?`)) return;
    await api.del(`/api/tasks/${task.id}`);
    load();
  }

  const bugun = tasks?.filter((t) => !isKelgusi(t.muddat)) ?? [];
  const kelgusi = tasks?.filter((t) => isKelgusi(t.muddat)) ?? [];

  return (
    <>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "var(--space-3)", flexWrap: "wrap" }}>
        <h1 style={{ margin: 0, fontSize: "var(--text-2xl)", fontWeight: "var(--weight-semibold)" }}>Vazifalar</h1>
        <Button variant="primary" onClick={() => setModal({ mode: "create" })} style={{ whiteSpace: "nowrap" }}>
          + Yangi vazifa
        </Button>
      </div>

      {xato && <EmptyState text={xato} />}
      {tasks === null && !xato && <EmptyState text="Yuklanmoqda..." />}
      {tasks !== null && tasks.length === 0 && (
        <EmptyState text="Hali vazifa yo'q. Birinchi vazifangizni qo'shing." />
      )}

      <TaskSection title="Bugun" tasks={bugun} onToggle={handleToggle} onEdit={(t) => setModal({ mode: "edit", task: t })} onDelete={handleDelete} />
      <TaskSection title="Kelgusi" tasks={kelgusi} onToggle={handleToggle} onEdit={(t) => setModal({ mode: "edit", task: t })} onDelete={handleDelete} />

      {modal && (
        <TaskFormModal
          initial={modal.mode === "edit" ? modal.task : null}
          goals={goals}
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
