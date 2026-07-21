// Diagnostika — qaysi env o'zgaruvchilar sozlanganini ko'rsatadi (QIYMATSIZ, faqat bor/yo'q).
// Maxfiy qiymatlar oshkor qilinmaydi.
// ?db=1 bilan chaqirilsa — bazaga ulanishni ham sinab ko'radi (xatoni ko'rsatadi).

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest): Promise<NextResponse> {
  const has = (n: string) => Boolean(process.env[n]);

  const body: Record<string, unknown> = {
    ok: true,
    env: {
      TELEGRAM_BOT_TOKEN: has("TELEGRAM_BOT_TOKEN"),
      AUTH_SECRET: has("AUTH_SECRET"),
      TELEGRAM_WEBHOOK_SECRET: has("TELEGRAM_WEBHOOK_SECRET"),
      ALLOWED_TELEGRAM_ID: has("ALLOWED_TELEGRAM_ID"),
      DATABASE_URL: has("DATABASE_URL"),
      DATABASE_URL_UNPOOLED: has("DATABASE_URL_UNPOOLED"),
      NEXT_PUBLIC_BOT_USERNAME: has("NEXT_PUBLIC_BOT_USERNAME"),
      NEXT_PUBLIC_APP_URL: has("NEXT_PUBLIC_APP_URL"),
    },
  };

  // ?db=1 — bazaga ulanishni sinaydi va Goal jadvali borligini tekshiradi.
  if (new URL(req.url).searchParams.get("db") === "1") {
    const t0 = Date.now();
    try {
      await prisma.$queryRawUnsafe("SELECT 1"); // ulanishning o'zi ishlayaptimi?
      try {
        const goalCount = await prisma.goal.count(); // jadval mavjudmi?
        body.db = { ok: true, connectMs: Date.now() - t0, goalTable: true, goalCount };
      } catch (e) {
        body.db = {
          ok: true,
          connectMs: Date.now() - t0,
          goalTable: false,
          goalTableError: e instanceof Error ? e.message : String(e),
        };
      }
    } catch (e) {
      body.db = {
        ok: false,
        ms: Date.now() - t0,
        error: e instanceof Error ? e.message : String(e),
      };
    }
  }

  return NextResponse.json(body);
}
