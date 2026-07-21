// AI bot system prompt (o'zini tutishi) — o'qish va saqlash.

import { NextRequest } from "next/server";
import { requireUser, json, badRequest, trimmedString } from "@/lib/api";
import { getSystemPrompt, saveSystemPrompt } from "@/lib/botConfig";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// GET /api/bot/config — joriy system prompt
export async function GET() {
  const guard = await requireUser();
  if ("error" in guard) return guard.error;
  return json({ systemPrompt: await getSystemPrompt() });
}

// POST /api/bot/config — system prompt'ni saqlaydi
export async function POST(req: NextRequest) {
  const guard = await requireUser();
  if ("error" in guard) return guard.error;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return badRequest("Yaroqsiz JSON");
  }
  const systemPrompt = trimmedString((body as Record<string, unknown>).systemPrompt);
  if (!systemPrompt) return badRequest("System prompt bo'sh bo'lishi mumkin emas");

  await saveSystemPrompt(systemPrompt);
  return json({ systemPrompt });
}
