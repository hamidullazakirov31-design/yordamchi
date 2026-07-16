// AI xulosasi — haftalik statistika (DB'dan hisoblanadi).
// AI matn generatsiyasi Sprint 3'da; hozircha statistik xulosa.

import { prisma } from "@/lib/db";
import { requireUser, json } from "@/lib/api";
import { Holat } from "@prisma/client";
import { hisoblaProgress } from "@/lib/progress";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Bugundan orqaga qarab, har kuni kamida bitta bajarilgan vazifa bo'lgan
// ketma-ket kunlar sonini hisoblaydi (streak).
function streakHisobla(sanalar: Date[]): number {
  const kunlar = new Set(
    sanalar.map((d) => {
      const x = new Date(d);
      x.setHours(0, 0, 0, 0);
      return x.getTime();
    }),
  );
  let streak = 0;
  const kun = new Date();
  kun.setHours(0, 0, 0, 0);
  // Bugun bajarilgan bo'lmasa, kechadan boshlab tekshiramiz.
  if (!kunlar.has(kun.getTime())) kun.setDate(kun.getDate() - 1);
  while (kunlar.has(kun.getTime())) {
    streak++;
    kun.setDate(kun.getDate() - 1);
  }
  return streak;
}

export async function GET() {
  const guard = await requireUser();
  if ("error" in guard) return guard.error;

  const goals = await prisma.goal.findMany({
    where: { userId: guard.user.id },
    include: { tasks: { select: { holat: true } } },
  });

  const faolMaqsadlar = goals.filter((g) => {
    const { holat } = hisoblaProgress(g.tasks);
    return g.tasks.length === 0 ? g.holat !== Holat.BAJARILDI : holat !== Holat.BAJARILDI;
  }).length;

  const bajarilganVazifalar = await prisma.task.count({
    where: { userId: guard.user.id, holat: Holat.BAJARILDI },
  });

  // Haftalik progress — maqsadlar progressining o'rtachasi.
  const progresslar = goals.map((g) =>
    g.tasks.length > 0 ? hisoblaProgress(g.tasks).progress : g.progress,
  );
  const haftalikProgress =
    progresslar.length > 0
      ? Math.round(progresslar.reduce((a, b) => a + b, 0) / progresslar.length)
      : 0;

  // Streak — bajarilgan vazifalar (yaratilgan/muddat) sanalari asosida.
  const bajarilgan = await prisma.task.findMany({
    where: { userId: guard.user.id, holat: Holat.BAJARILDI },
    select: { muddat: true, yaratilganSana: true },
  });
  const streak = streakHisobla(
    bajarilgan.map((t) => t.muddat ?? t.yaratilganSana),
  );

  const xulosaMatni =
    goals.length === 0
      ? "Hali maqsad qo'shilmagan. Birinchi maqsadingizni qo'shing va unga vazifalar biriktiring — bu yerda haftalik tahlil paydo bo'ladi."
      : `Hozircha ${faolMaqsadlar} ta faol maqsad ustida ishlayapsiz va jami ${bajarilganVazifalar} ta vazifa bajarildi. Umumiy progress ${haftalikProgress}% darajasida. (To'liq AI tahlili Sprint 3'da qo'shiladi.)`;

  return json({
    statistika: [
      { label: "Faol maqsadlar", value: String(faolMaqsadlar) },
      { label: "Bajarilgan vazifalar", value: String(bajarilganVazifalar) },
      { label: "Haftalik progress", value: `${haftalikProgress}%` },
      { label: "Ketma-ketlik (streak)", value: `${streak} kun` },
    ],
    xulosa: xulosaMatni,
  });
}
