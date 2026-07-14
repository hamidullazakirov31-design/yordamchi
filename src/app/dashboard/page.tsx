// Himoyalangan bosh sahifa — faqat yaroqli sessiya bilan ochiladi.

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifySession, SESSION_COOKIE } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const token = cookies().get(SESSION_COOKIE)?.value;
  if (!token) redirect("/login");

  let user;
  try {
    user = await verifySession(token!);
  } catch {
    redirect("/login");
  }

  const ism = user.ism || user.username || "foydalanuvchi";

  return (
    <main className="mx-auto min-h-screen max-w-2xl px-4 py-12">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Yordamchi</h1>
        <form action="/api/auth/logout" method="post">
          <button
            type="submit"
            className="rounded-lg border border-slate-700 px-3 py-1.5 text-sm text-slate-300 transition hover:bg-slate-800"
          >
            Chiqish
          </button>
        </form>
      </div>

      <div className="mt-8 rounded-2xl border border-slate-800 bg-slate-900 p-6">
        <p className="text-lg">
          Xush kelibsiz, <span className="font-semibold">{ism}</span>! 👋
        </p>
        <p className="mt-2 text-sm text-slate-400">
          Siz Telegram orqali muvaffaqiyatli avtorizatsiyadan o&apos;tdingiz.
        </p>
        <dl className="mt-4 space-y-1 text-sm text-slate-400">
          <div className="flex gap-2">
            <dt className="text-slate-500">Telegram ID:</dt>
            <dd className="font-mono text-slate-300">{user.telegramId}</dd>
          </div>
          {user.username && (
            <div className="flex gap-2">
              <dt className="text-slate-500">Username:</dt>
              <dd className="text-slate-300">@{user.username}</dd>
            </div>
          )}
        </dl>
      </div>

      <p className="mt-6 text-center text-xs text-slate-600">
        Sprint 1 · 1-qism — Telegram deep-link avtorizatsiya asosi
      </p>
    </main>
  );
}
