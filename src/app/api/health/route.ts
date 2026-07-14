// Diagnostika — qaysi env o'zgaruvchilar sozlanganini ko'rsatadi (QIYMATSIZ, faqat bor/yo'q).
// Maxfiy qiymatlar oshkor qilinmaydi.

import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(): Promise<NextResponse> {
  const has = (n: string) => Boolean(process.env[n]);
  return NextResponse.json({
    ok: true,
    env: {
      TELEGRAM_BOT_TOKEN: has("TELEGRAM_BOT_TOKEN"),
      AUTH_SECRET: has("AUTH_SECRET"),
      TELEGRAM_WEBHOOK_SECRET: has("TELEGRAM_WEBHOOK_SECRET"),
      ALLOWED_TELEGRAM_ID: has("ALLOWED_TELEGRAM_ID"),
      DATABASE_URL: has("DATABASE_URL"),
      NEXT_PUBLIC_BOT_USERNAME: has("NEXT_PUBLIC_BOT_USERNAME"),
      NEXT_PUBLIC_APP_URL: has("NEXT_PUBLIC_APP_URL"),
    },
  });
}
