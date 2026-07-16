// API route'lar uchun umumiy yordamchilar: auth guard, JSON javoblar, validatsiya.

import { NextResponse } from "next/server";
import { getDbUser } from "@/lib/session";
import type { User } from "@prisma/client";

// Route handler ichida joriy foydalanuvchini oladi yoki 401 qaytaradi.
// Foydalanish: const guard = await requireUser(); if ("error" in guard) return guard.error;
export async function requireUser(): Promise<
  { user: User } | { error: NextResponse }
> {
  const user = await getDbUser();
  if (!user) {
    return { error: NextResponse.json({ xato: "Avtorizatsiya talab qilinadi" }, { status: 401 }) };
  }
  return { user };
}

export function badRequest(xato: string): NextResponse {
  return NextResponse.json({ xato }, { status: 400 });
}

export function notFound(xato = "Topilmadi"): NextResponse {
  return NextResponse.json({ xato }, { status: 404 });
}

// BigInt maydonlarni JSON'ga o'giradi (telegramId kabi).
export function json(data: unknown, init?: ResponseInit): NextResponse {
  return new NextResponse(
    JSON.stringify(data, (_k, v) => (typeof v === "bigint" ? v.toString() : v)),
    { ...init, headers: { "content-type": "application/json", ...(init?.headers ?? {}) } },
  );
}

// ---- Validatsiya yordamchilari ----

export function trimmedString(v: unknown): string | null {
  if (typeof v !== "string") return null;
  const t = v.trim();
  return t.length > 0 ? t : null;
}

export function optionalString(v: unknown): string | null {
  if (v === null || v === undefined || v === "") return null;
  if (typeof v !== "string") return null;
  const t = v.trim();
  return t.length > 0 ? t : null;
}

// ISO/date-string'ni Date'ga o'giradi; noto'g'ri bo'lsa undefined (xato), yo'q bo'lsa null.
export function parseDate(v: unknown): Date | null | undefined {
  if (v === null || v === undefined || v === "") return null;
  if (typeof v !== "string") return undefined;
  const d = new Date(v);
  return isNaN(d.getTime()) ? undefined : d;
}

// 1..3 oralig'idagi muhimlik.
export function parseMuhimlik(v: unknown): number {
  const n = Number(v);
  if (!Number.isFinite(n)) return 2;
  return Math.max(1, Math.min(3, Math.round(n)));
}
