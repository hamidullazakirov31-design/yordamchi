// Vazifalar (Task) CRUD — ro'yxat va yaratish.

import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { requireUser, badRequest, json, trimmedString, optionalString, parseDate, parseMuhimlik } from "@/lib/api";
import { taskToDTO, yangilaGoalProgress } from "@/lib/progress";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Foydalanuvchiga tegishli goalId ekanini tekshiradi.
async function goalTegishlimi(goalId: string, userId: string): Promise<boolean> {
  const g = await prisma.goal.findFirst({ where: { id: goalId, userId }, select: { id: true } });
  return !!g;
}

// GET /api/tasks — barcha vazifalar (filtr: ?goalId=)
export async function GET(req: NextRequest) {
  const guard = await requireUser();
  if ("error" in guard) return guard.error;

  const goalId = req.nextUrl.searchParams.get("goalId");

  const tasks = await prisma.task.findMany({
    where: { userId: guard.user.id, ...(goalId ? { goalId } : {}) },
    orderBy: [{ muddat: "asc" }, { muhimlik: "desc" }],
    include: { goal: { select: { id: true, sarlavha: true } } },
  });

  return json({ vazifalar: tasks.map(taskToDTO) });
}

// POST /api/tasks — yangi vazifa
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

  const goalId = optionalString(b.goalId);
  if (goalId && !(await goalTegishlimi(goalId, guard.user.id))) {
    return badRequest("Bunday maqsad topilmadi");
  }

  const task = await prisma.task.create({
    data: {
      userId: guard.user.id,
      goalId,
      sarlavha,
      tavsif: optionalString(b.tavsif),
      muddat,
      muhimlik: parseMuhimlik(b.muhimlik),
    },
    include: { goal: { select: { id: true, sarlavha: true } } },
  });

  if (goalId) await yangilaGoalProgress(goalId);

  return json({ vazifa: taskToDTO(task) }, { status: 201 });
}
