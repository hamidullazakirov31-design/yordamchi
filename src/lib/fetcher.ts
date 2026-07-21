"use client";

// Client tomonidagi API chaqiruvlari uchun yupqa yordamchi.

async function handle<T>(res: Response): Promise<T> {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error((data as { xato?: string }).xato || "Xatolik yuz berdi");
  }
  return data as T;
}

// So'rov cheksiz osilib qolmasligi uchun timeout (AbortController).
// Server javob bermasa foydalanuvchi "Yuklanmoqda..." da qotib qolmaydi,
// balki aniq xato ko'radi.
const TIMEOUT_MS = 20000;

async function req<T>(url: string, init: RequestInit): Promise<T> {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(url, { ...init, signal: ctrl.signal });
    return await handle<T>(res);
  } catch (e) {
    if (e instanceof DOMException && e.name === "AbortError") {
      throw new Error(
        "Server javob bermadi (vaqt tugadi). Iltimos, birozdan so'ng qayta urinib ko'ring."
      );
    }
    throw e instanceof Error ? e : new Error("Tarmoq xatosi");
  } finally {
    clearTimeout(timer);
  }
}

const jsonInit = (method: string, body: unknown): RequestInit => ({
  method,
  headers: { "content-type": "application/json" },
  body: JSON.stringify(body),
});

export const api = {
  get: <T>(url: string) => req<T>(url, { cache: "no-store" }),
  post: <T>(url: string, body: unknown) => req<T>(url, jsonInit("POST", body)),
  patch: <T>(url: string, body: unknown) => req<T>(url, jsonInit("PATCH", body)),
  del: <T>(url: string) => req<T>(url, { method: "DELETE" }),
};

// ISO sana → "DD.MM.YYYY" (dizayn formati). Bo'sh bo'lsa "—".
export function formatDate(iso: string | null): string {
  if (!iso) return "—";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "—";
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  return `${dd}.${mm}.${d.getFullYear()}`;
}

// ISO sana → <input type="date"> qiymati (YYYY-MM-DD).
export function toDateInput(iso: string | null): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "";
  return d.toISOString().slice(0, 10);
}
