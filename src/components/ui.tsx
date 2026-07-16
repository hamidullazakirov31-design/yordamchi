"use client";

// Aurora Design System — qayta ishlatiladigan UI komponentlar.
// Dizayn ZIP'idagi _ds_bundle.js komponentlariga mos ravishda qayta yozilgan.

import React from "react";

/* ---------- Card ---------- */
export function Card({
  children,
  style,
  onClick,
}: {
  children: React.ReactNode;
  style?: React.CSSProperties;
  onClick?: (e: React.MouseEvent) => void;
}) {
  return (
    <div
      onClick={onClick}
      style={{
        background: "var(--color-surface)",
        border: "1px solid var(--color-border)",
        borderRadius: "var(--radius-lg)",
        boxShadow: "var(--shadow-card)",
        padding: "var(--space-4)",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

/* ---------- Button ---------- */
type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "danger" | "ghost";
};

export function Button({
  variant = "primary",
  style,
  children,
  ...rest
}: ButtonProps) {
  const palette: Record<string, React.CSSProperties> = {
    primary: {
      background: "var(--color-primary)",
      color: "var(--color-text-on-primary)",
      border: "1px solid var(--color-primary)",
    },
    secondary: {
      background: "var(--color-surface)",
      color: "var(--color-text)",
      border: "1px solid var(--color-border-strong)",
    },
    danger: {
      background: "var(--color-danger)",
      color: "var(--color-white)",
      border: "1px solid var(--color-danger)",
    },
    ghost: {
      background: "transparent",
      color: "var(--color-text-muted)",
      border: "1px solid transparent",
    },
  };
  return (
    <button
      {...rest}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "var(--space-2)",
        padding: "var(--space-2) var(--space-4)",
        borderRadius: "var(--radius-md)",
        fontFamily: "var(--font-family-base)",
        fontSize: "var(--text-body)",
        fontWeight: "var(--weight-semibold)",
        cursor: rest.disabled ? "not-allowed" : "pointer",
        opacity: rest.disabled ? 0.6 : 1,
        transition: "filter 120ms ease",
        ...palette[variant],
        ...style,
      }}
      onMouseEnter={(e) => {
        if (!rest.disabled) e.currentTarget.style.filter = "brightness(0.96)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.filter = "none";
      }}
    >
      {children}
    </button>
  );
}

/* ---------- Input ---------- */
type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
};

export function Input({ label, error, style, ...rest }: InputProps) {
  return (
    <label style={{ display: "flex", flexDirection: "column", gap: "var(--space-1)" }}>
      {label && (
        <span
          style={{
            fontSize: "var(--text-sm)",
            fontWeight: "var(--weight-medium)",
            color: "var(--color-text)",
          }}
        >
          {label}
        </span>
      )}
      <input
        {...rest}
        style={{
          padding: "var(--space-2) var(--space-3)",
          borderRadius: "var(--radius-md)",
          border: `1px solid ${error ? "var(--color-danger)" : "var(--color-border-strong)"}`,
          fontFamily: "var(--font-family-base)",
          fontSize: "var(--text-body)",
          color: "var(--color-text)",
          background: "var(--color-surface)",
          outline: "none",
          ...style,
        }}
      />
      {error && (
        <span style={{ fontSize: "var(--text-xs)", color: "var(--color-danger)" }}>
          {error}
        </span>
      )}
    </label>
  );
}

/* ---------- Textarea ---------- */
type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label?: string;
};

export function Textarea({ label, style, ...rest }: TextareaProps) {
  return (
    <label style={{ display: "flex", flexDirection: "column", gap: "var(--space-1)" }}>
      {label && (
        <span
          style={{
            fontSize: "var(--text-sm)",
            fontWeight: "var(--weight-medium)",
            color: "var(--color-text)",
          }}
        >
          {label}
        </span>
      )}
      <textarea
        {...rest}
        style={{
          padding: "var(--space-2) var(--space-3)",
          borderRadius: "var(--radius-md)",
          border: "1px solid var(--color-border-strong)",
          fontFamily: "var(--font-family-base)",
          fontSize: "var(--text-body)",
          color: "var(--color-text)",
          background: "var(--color-surface)",
          outline: "none",
          resize: "vertical",
          minHeight: 72,
          ...style,
        }}
      />
    </label>
  );
}

/* ---------- ProgressBar ---------- */
export function ProgressBar({ value, label }: { value: number; label?: string }) {
  const pct = Math.max(0, Math.min(100, value));
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-1)" }}>
      {label && (
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: "var(--text-xs)",
            color: "var(--color-text-muted)",
            fontWeight: "var(--weight-medium)",
          }}
        >
          <span>{label}</span>
          <span>{pct}%</span>
        </div>
      )}
      <div
        style={{
          height: 8,
          borderRadius: "var(--radius-pill)",
          background: "var(--color-slate-100)",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${pct}%`,
            height: "100%",
            borderRadius: "var(--radius-pill)",
            background: pct >= 100 ? "var(--color-success)" : "var(--color-primary)",
            transition: "width 200ms ease",
          }}
        />
      </div>
    </div>
  );
}

/* ---------- StatusTag ---------- */
export function StatusTag({
  status,
  children,
}: {
  status: "done" | "pending";
  children: React.ReactNode;
}) {
  const isDone = status === "done";
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "var(--space-1)",
        fontSize: "var(--text-xs)",
        fontWeight: "var(--weight-semibold)",
        color: isDone ? "var(--color-success)" : "var(--color-pending)",
        background: isDone ? "var(--color-success-tint)" : "var(--color-pending-tint)",
        borderRadius: "var(--radius-pill)",
        padding: "4px var(--space-2)",
        lineHeight: 1.2,
        whiteSpace: "nowrap",
      }}
    >
      <span
        style={{
          width: 6,
          height: 6,
          borderRadius: "50%",
          background: "currentColor",
          flexShrink: 0,
        }}
      />
      {children}
    </span>
  );
}

/* ---------- PriorityTag ---------- */
const PRIORITY_STYLES: Record<number, { label: string; fg: string; bg: string }> = {
  3: { label: "Yuqori", fg: "var(--color-danger)", bg: "var(--color-danger-tint)" },
  2: { label: "O'rta", fg: "var(--color-pending)", bg: "var(--color-pending-tint)" },
  1: { label: "Past", fg: "var(--color-text-muted)", bg: "var(--color-slate-100)" },
};

export function PriorityTag({ muhimlik }: { muhimlik: number }) {
  const cfg = PRIORITY_STYLES[muhimlik] || PRIORITY_STYLES[2];
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "var(--space-1)",
        fontSize: "var(--text-xs)",
        fontWeight: "var(--weight-semibold)",
        color: cfg.fg,
        background: cfg.bg,
        borderRadius: "var(--radius-pill)",
        padding: "4px var(--space-2)",
        lineHeight: 1.2,
        whiteSpace: "nowrap",
      }}
    >
      <span
        style={{ width: 6, height: 6, borderRadius: "50%", background: cfg.fg, flexShrink: 0 }}
      />
      {cfg.label}
    </span>
  );
}

/* ---------- Modal ---------- */
export function Modal({
  children,
  onClose,
}: {
  children: React.ReactNode;
  onClose: () => void;
}) {
  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(15, 23, 42, 0.4)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "var(--space-4)",
        zIndex: 100,
      }}
    >
      <Card
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%",
          maxWidth: 440,
          display: "flex",
          flexDirection: "column",
          gap: "var(--space-4)",
          maxHeight: "90vh",
          overflowY: "auto",
        }}
      >
        {children}
      </Card>
    </div>
  );
}

/* ---------- Kebab menu (Tahrirlash / O'chirish) ---------- */
export function RowMenu({
  onEdit,
  onDelete,
}: {
  onEdit: () => void;
  onDelete: () => void;
}) {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const itemStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: "var(--space-2)",
    padding: "var(--space-2)",
    border: "none",
    background: "transparent",
    borderRadius: "var(--radius-sm)",
    fontFamily: "var(--font-family-base)",
    fontSize: "var(--text-body)",
    textAlign: "left",
    cursor: "pointer",
  };

  return (
    <div ref={ref} style={{ position: "relative", flexShrink: 0 }}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="Ko'proq"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: 28,
          height: 28,
          padding: 0,
          border: "none",
          borderRadius: "var(--radius-sm)",
          background: open ? "var(--color-slate-100)" : "transparent",
          color: "var(--color-text-muted)",
          cursor: "pointer",
        }}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
          <circle cx="12" cy="5" r="1.8" />
          <circle cx="12" cy="12" r="1.8" />
          <circle cx="12" cy="19" r="1.8" />
        </svg>
      </button>

      {open && (
        <div
          style={{
            position: "absolute",
            top: 32,
            right: 0,
            minWidth: 150,
            background: "var(--color-surface)",
            border: "1px solid var(--color-border)",
            borderRadius: "var(--radius-md)",
            boxShadow: "var(--shadow-card)",
            padding: "var(--space-1)",
            display: "flex",
            flexDirection: "column",
            zIndex: 20,
          }}
        >
          <button
            type="button"
            onClick={() => {
              setOpen(false);
              onEdit();
            }}
            style={{ ...itemStyle, color: "var(--color-text)" }}
          >
            Tahrirlash
          </button>
          <button
            type="button"
            onClick={() => {
              setOpen(false);
              onDelete();
            }}
            style={{ ...itemStyle, color: "var(--color-danger)" }}
          >
            O&apos;chirish
          </button>
        </div>
      )}
    </div>
  );
}

/* ---------- Bo'sh holat ---------- */
export function EmptyState({ text }: { text: string }) {
  return (
    <Card
      style={{
        textAlign: "center",
        color: "var(--color-text-muted)",
        fontSize: "var(--text-body)",
        padding: "var(--space-6)",
      }}
    >
      {text}
    </Card>
  );
}
