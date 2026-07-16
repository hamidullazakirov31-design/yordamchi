// Bitta vazifa — tahrirlash (holatni belgilash ham), o'chirish.

import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { requireUser, badRequest, notFound, json, trimmedString, optionalString, parseDate, parseMuhimlik } from "@/lib/api";
import { taskToDTO, yangilaGoalProgress } from "@/lib/progress";
import { Holat } from "@prisma/client";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Ctx = { params: { id: string } };

// PATCH /api/tasks/[id] — maydonlarni yoki holatni yangilash
export async function PATCH(req: NextRequest, { params }: Ctx) {
  const guard = await requireUser();
  if ("error" in guard) return guard.error;

  const mavjud = await prisma.task.findFirst({
    where: { id: params.id, userId: guard.user.id },
  });
  if (!mavjud) return notFound("Vazifa topilmadi");

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return badRequest("Yaroqsiz JSON");
  }
  const b = body as Record<string, unknown>;

  const data: Record<string, unknown> = {};

  if ("sarlavha" in b) {
    const sarlavha = trimmedString(b.sarlavha);
    if (!sarlavha) return badRequest("Sarlavha bo'sh bo'lishi mumkin emas");
    data.sarlavha = sarlavha;
  }
  if ("tavsif" in b) data.tavsif = optionalString(b.tavsif);
  if ("muhimlik" in b) data.muhimlik = parseMuhimlik(b.muhimlik);
  if ("muddat" in b) {
    const muddat = parseDate(b.muddat);
    if (muddat === undefined) return badRequest("Muddat sanasi yaroqsiz");
    data.muddat = muddat;
  }
  if ("goalId" in b) {
    const goalId = optionalString(b.goalId);
    if (goalId) {
      const g = await prisma.goal.findFirst({ where: { id: goalId, userId: guard.user.id }, select: { id: true } });
      if (!g) return badRequest("Bunday maqsad topilmadi");
    }
    data.goalId = goalId;
  }
  // Vazifani "bajarildi" / "rejada" deb belgilash
  if ("bajarildi" in b) {
    data.holat = b.bajarildi ? Holat.BAJARILDI : Holat.REJADA;
  } else if ("holat" in b && typeof b.holat === "string" && b.holat in Holat) {
    data.holat = b.holat as Holat;
  }

  const task = await prisma.task.update({
    where: { id: params.id },
    data,
    include: { goal: { select: { id: true, sarlavha: true } } },
  });

  // Eski va yangi maqsad progressini qayta hisoblaymiz.
  const goalIds = new Set<string>();
  if (mavjud.goalId) goalIds.add(mavjud.goalId);
  if (task.goalId) goalIds.add(task.goalId);
  for (const gid of goalIds) await yangilaGoalProgress(gid);

  return json({ vazifa: taskToDTO(task) });
}

// DELETE /api/tasks/[id]
export async function DELETE(_req: NextRequest, { params }: Ctx) {
  const guard = await requireUser();
  if ("error" in guard) return guard.error;

  const mavjud = await prisma.task.findFirst({
    where: { id: params.id, userId: guard.user.id },
  });
  if (!mavjud) return notFound("Vazifa topilmadi");

  await prisma.task.delete({ where: { id: params.id } });
  if (mavjud.goalId) await yangilaGoalProgress(mavjud.goalId);

  return json({ ok: true });
}
