// Progress avtomatik hisoblash va API DTO'lariga o'girish.
// Maqsad progressi vazifalar bajarilishidan kelib chiqadi (Sprint 2 DoD talabi).

import { prisma } from "@/lib/db";
import { Holat, type Goal, type Task } from "@prisma/client";

// Maqsad va uning vazifalari asosida progress (%) va holatni hisoblaydi.
export function hisoblaProgress(tasks: { holat: Holat }[]): {
  progress: number;
  holat: Holat;
} {
  const jami = tasks.length;
  if (jami === 0) return { progress: 0, holat: Holat.REJADA };
  const bajarilgan = tasks.filter((t) => t.holat === Holat.BAJARILDI).length;
  const progress = Math.round((bajarilgan / jami) * 100);
  const holat =
    bajarilgan === jami
      ? Holat.BAJARILDI
      : bajarilgan === 0
        ? Holat.REJADA
        : Holat.JARAYONDA;
  return { progress, holat };
}

// Maqsadning progress/holatini vazifalaridan qayta hisoblab, DB'ga yozadi.
// Vazifa yaratilganda/o'zgarganda/o'chirilganda chaqiriladi.
export async function yangilaGoalProgress(goalId: string): Promise<void> {
  const tasks = await prisma.task.findMany({
    where: { goalId },
    select: { holat: true },
  });
  const { progress, holat } = hisoblaProgress(tasks);
  await prisma.goal.update({ where: { id: goalId }, data: { progress, holat } });
}

// ---- API DTO serializerlari ----

type GoalWithTasks = Goal & { tasks: { holat: Holat }[] };

export function goalToDTO(goal: GoalWithTasks) {
  const jami = goal.tasks.length;
  const bajarilgan = goal.tasks.filter((t) => t.holat === Holat.BAJARILDI).length;
  // Vazifalar bo'lsa — real vaqtda hisoblaymiz; bo'lmasa — saqlangan qiymat.
  const { progress, holat } = jami > 0 ? hisoblaProgress(goal.tasks) : { progress: goal.progress, holat: goal.holat };
  return {
    id: goal.id,
    sarlavha: goal.sarlavha,
    tavsif: goal.tavsif,
    muddat: goal.muddat ? goal.muddat.toISOString() : null,
    progress,
    holat,
    bajarilgan: holat === Holat.BAJARILDI,
    vazifalarSoni: jami,
    bajarilganSoni: bajarilgan,
  };
}

type TaskWithGoal = Task & { goal: { id: string; sarlavha: string } | null };

export function taskToDTO(task: TaskWithGoal) {
  return {
    id: task.id,
    sarlavha: task.sarlavha,
    tavsif: task.tavsif,
    goalId: task.goalId,
    goalSarlavha: task.goal?.sarlavha ?? null,
    muddat: task.muddat ? task.muddat.toISOString() : null,
    muhimlik: task.muhimlik,
    holat: task.holat,
    bajarildi: task.holat === Holat.BAJARILDI,
  };
}
