// Bitta maqsad — olish, tahrirlash, o'chirish.

import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { requireUser, badRequest, notFound, json, trimmedString, optionalString, parseDate } from "@/lib/api";
import { goalToDTO, taskToDTO } from "@/lib/progress";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Ctx = { params: { id: string } };

// GET /api/goals/[id] — maqsad + uning vazifalari
export async function GET(_req: NextRequest, { params }: Ctx) {
  const guard = await requireUser();
  if ("error" in guard) return guard.error;

  const goal = await prisma.goal.findFirst({
    where: { id: params.id, userId: guard.user.id },
    include: {
      tasks: {
        orderBy: { muhimlik: "desc" },
        include: { goal: { select: { id: true, sarlavha: true } } },
      },
    },
  });
  if (!goal) return notFound("Maqsad topilmadi");

  return json({
    maqsad: goalToDTO(goal),
    vazifalar: goal.tasks.map(taskToDTO),
  });
}

// PATCH /api/goals/[id] — tahrirlash
export async function PATCH(req: NextRequest, { params }: Ctx) {
  const guard = await requireUser();
  if ("error" in guard) return guard.error;

  const mavjud = await prisma.goal.findFirst({
    where: { id: params.id, userId: guard.user.id },
  });
  if (!mavjud) return notFound("Maqsad topilmadi");

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
  if ("muddat" in b) {
    const muddat = parseDate(b.muddat);
    if (muddat === undefined) return badRequest("Muddat sanasi yaroqsiz");
    data.muddat = muddat;
  }

  const goal = await prisma.goal.update({
    where: { id: params.id },
    data,
    include: { tasks: { select: { holat: true } } },
  });

  return json({ maqsad: goalToDTO(goal) });
}

// DELETE /api/goals/[id]
export async function DELETE(_req: NextRequest, { params }: Ctx) {
  const guard = await requireUser();
  if ("error" in guard) return guard.error;

  const mavjud = await prisma.goal.findFirst({
    where: { id: params.id, userId: guard.user.id },
  });
  if (!mavjud) return notFound("Maqsad topilmadi");

  await prisma.goal.delete({ where: { id: params.id } });
  return json({ ok: true });
}
