// Bitta bilim yozuvi — faol/nofaol qilish va o'chirish.

import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { requireUser, json, badRequest, notFound } from "@/lib/api";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// PATCH /api/bot/knowledge/:id — faol holatini yangilaydi ({ faol: boolean })
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const guard = await requireUser();
  if ("error" in guard) return guard.error;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return badRequest("Yaroqsiz JSON");
  }
  const faol = (body as Record<string, unknown>).faol;
  if (typeof faol !== "boolean") return badRequest("faol qiymati boolean bo'lishi kerak");

  try {
    const item = await prisma.knowledgeItem.update({
      where: { id: params.id },
      data: { faol },
    });
    return json({ bilim: item });
  } catch {
    return notFound("Yozuv topilmadi");
  }
}

// DELETE /api/bot/knowledge/:id — yozuvni o'chiradi
export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const guard = await requireUser();
  if ("error" in guard) return guard.error;

  try {
    await prisma.knowledgeItem.delete({ where: { id: params.id } });
    return json({ ok: true });
  } catch {
    return notFound("Yozuv topilmadi");
  }
}
