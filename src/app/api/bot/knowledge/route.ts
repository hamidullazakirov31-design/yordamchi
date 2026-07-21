// Bilim bazasi yozuvlari — ro'yxat va yaratish.

import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { requireUser, json, badRequest, trimmedString } from "@/lib/api";
import { getKnowledgeItems } from "@/lib/botConfig";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// GET /api/bot/knowledge — barcha yozuvlar
export async function GET() {
  const guard = await requireUser();
  if ("error" in guard) return guard.error;
  return json({ bilimlar: await getKnowledgeItems(false) });
}

// POST /api/bot/knowledge — yangi yozuv
export async function POST(req: NextRequest) {
  const guard = await requireUser();
  if ("error" in guard) return guard.error;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return badRequest("Yaroqsiz JSON");
  }
  const b = body as Record<string, unknown>;
  const sarlavha = trimmedString(b.sarlavha);
  const matn = trimmedString(b.matn);
  if (!sarlavha) return badRequest("Sarlavha kiritilishi shart");
  if (!matn) return badRequest("Matn kiritilishi shart");

  const item = await prisma.knowledgeItem.create({ data: { sarlavha, matn } });
  return json({ bilim: item }, { status: 201 });
}
