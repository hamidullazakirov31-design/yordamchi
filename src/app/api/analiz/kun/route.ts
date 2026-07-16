// Kun tahlili — bugungi vazifalar holati + tavsiyalar.
// AI matn generatsiyasi Sprint 3'da qo'shiladi; hozircha statik tavsiyalar.

import { prisma } from "@/lib/db";
import { requireUser, json } from "@/lib/api";
import { Holat } from "@prisma/client";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function bugunOraligi(): { boshi: Date; oxiri: Date } {
  const boshi = new Date();
  boshi.setHours(0, 0, 0, 0);
  const oxiri = new Date(boshi);
  oxiri.setDate(oxiri.getDate() + 1);
  return { boshi, oxiri };
}

const TAVSIYALAR = [
  "Ertangi kunni ortda qolayotgan maqsadingizga tegishli bitta aniq vazifadan boshlang.",
  "Ketma-ketlikni uzmaslik uchun kamida bitta vazifani kun boshida bajaring.",
  "Yuqori muhimlikdagi vazifalarni ertalabga rejalashtiring — diqqat tarqalmasdan oldin.",
];

export async function GET() {
  const guard = await requireUser();
  if ("error" in guard) return guard.error;

  const { boshi, oxiri } = bugunOraligi();

  const bugungi = await prisma.task.findMany({
    where: {
      userId: guard.user.id,
      muddat: { gte: boshi, lt: oxiri },
    },
    include: { goal: { select: { sarlavha: true } } },
    orderBy: { muhimlik: "desc" },
  });

  const map = (t: (typeof bugungi)[number]) => ({
    id: t.id,
    sarlavha: t.sarlavha,
    maqsad: t.goal?.sarlavha ?? "Bog'lanmagan",
  });

  const bajarilgan = bugungi.filter((t) => t.holat === Holat.BAJARILDI).map(map);
  const bajarilmagan = bugungi.filter((t) => t.holat !== Holat.BAJARILDI).map(map);

  const jami = bugungi.length;
  const sarlavha =
    jami === 0
      ? "Bugunga rejalashtirilgan vazifa yo'q."
      : `Bugun rejalashtirilgan ${jami} ta vazifadan ${bajarilgan.length} tasi bajarildi.`;

  return json({
    sana: boshi.toISOString(),
    xulosa: sarlavha,
    bajarilgan,
    bajarilmagan,
    tavsiyalar: TAVSIYALAR,
  });
}
