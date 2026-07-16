// Maqsadlar (Goal) CRUD — ro'yxat va yaratish.

import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { requireUser, badRequest, json, trimmedString, optionalString, parseDate } from "@/lib/api";
import { goalToDTO } from "@/lib/progress";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// GET /api/goals — joriy foydalanuvchining barcha maqsadlari
export async function GET() {
  const guard = await requireUser();
  if ("error" in guard) return guard.error;

  const goals = await prisma.goal.findMany({
    where: { userId: guard.user.id },
    orderBy: { yaratilganSana: "desc" },
    include: { tasks: { select: { holat: true } } },
  });

  return json({ maqsadlar: goals.map(goalToDTO) });
}

// POST /api/goals — yangi maqsad
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
  if (!sarlavha) return badRequest("Sarlavha kiritilishi shart");

  const muddat = parseDate(b.muddat);
  if (muddat === undefined) return badRequest("Muddat sanasi yaroqsiz");

  const goal = await prisma.goal.create({
    data: {
      userId: guard.user.id,
      sarlavha,
      tavsif: optionalString(b.tavsif),
      muddat,
    },
    include: { tasks: { select: { holat: true } } },
  });

  return json({ maqsad: goalToDTO(goal) }, { status: 201 });
}
