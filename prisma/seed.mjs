// Test ma'lumot seed skripti — ruxsat etilgan foydalanuvchi uchun
// bir nechta maqsad va vazifa yaratadi (dizayndagi namunaga mos).
//
// Ishga tushirish:  npm run db:seed
// DATABASE_URL (.env.local yoki muhit) sozlangan bo'lishi shart.

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const TELEGRAM_ID = BigInt(process.env.ALLOWED_TELEGRAM_ID ?? "1271615246");

// Bugundan nisbatan sana (kun qo'shib) — soat 12:00 da.
function kun(qoshimcha) {
  const d = new Date();
  d.setHours(12, 0, 0, 0);
  d.setDate(d.getDate() + qoshimcha);
  return d;
}

async function main() {
  // 1) Foydalanuvchi
  const user = await prisma.user.upsert({
    where: { telegramId: TELEGRAM_ID },
    update: {},
    create: { telegramId: TELEGRAM_ID, ism: "Test foydalanuvchi" },
  });
  console.log(`Foydalanuvchi tayyor: ${user.id} (telegramId=${TELEGRAM_ID})`);

  // 2) Eski test maqsadlarini tozalaymiz (cascade orqali vazifalar ham o'chadi)
  await prisma.goal.deleteMany({ where: { userId: user.id } });

  // 3) Maqsadlar
  const goalDefs = [
    { key: "ingliz", sarlavha: "Ingliz tilini o'rganish", tavsif: "IELTS imtihonidan kamida 7.0 ball to'plash uchun har kuni mashq qilish.", muddat: kun(76) },
    { key: "soglom", sarlavha: "Sog'lom turmush tarzi", tavsif: "Har kuni kamida 30 daqiqa yugurish va tartibli ovqatlanish.", muddat: kun(30) },
    { key: "loyiha", sarlavha: "Loyihani yakunlash", tavsif: "Mobil ilovaning MVP versiyasini ishlab chiqib, foydalanuvchilarga taqdim etish.", muddat: kun(77) },
    { key: "kitob", sarlavha: "Kitob o'qish", tavsif: "Yil davomida kamida 24 ta kitobni to'liq o'qib tugatish.", muddat: kun(168) },
  ];

  const goals = {};
  for (const g of goalDefs) {
    const created = await prisma.goal.create({
      data: { userId: user.id, sarlavha: g.sarlavha, tavsif: g.tavsif, muddat: g.muddat },
    });
    goals[g.key] = created;
  }
  console.log(`${goalDefs.length} ta maqsad yaratildi.`);

  // 4) Vazifalar (muhimlik: 3=yuqori, 2=o'rta, 1=past)
  const taskDefs = [
    { sarlavha: "IELTS Reading mashqi", goal: "ingliz", muddat: kun(0), muhimlik: 3, holat: "BAJARILDI" },
    { sarlavha: "30 daqiqa yugurish", goal: "soglom", muddat: kun(0), muhimlik: 2, holat: "BAJARILDI" },
    { sarlavha: "MVP uchun login ekranini yasash", goal: "loyiha", muddat: kun(0), muhimlik: 3, holat: "REJADA" },
    { sarlavha: "Grammatika testini topshirish", goal: "ingliz", muddat: kun(3), muhimlik: 2, holat: "REJADA" },
    { sarlavha: "Yangi kitob tanlash", goal: "kitob", muddat: kun(6), muhimlik: 1, holat: "REJADA" },
    { sarlavha: "Backend API ni sinovdan o'tkazish", goal: "loyiha", muddat: kun(11), muhimlik: 3, holat: "REJADA" },
    { sarlavha: "Kunlik so'z yodlash (20 ta)", goal: "ingliz", muddat: kun(0), muhimlik: 2, holat: "BAJARILDI" },
  ];

  for (const t of taskDefs) {
    await prisma.task.create({
      data: {
        userId: user.id,
        goalId: goals[t.goal].id,
        sarlavha: t.sarlavha,
        muddat: t.muddat,
        muhimlik: t.muhimlik,
        holat: t.holat,
      },
    });
  }
  console.log(`${taskDefs.length} ta vazifa yaratildi.`);

  // 5) Har bir maqsad progressini vazifalaridan qayta hisoblaymiz
  for (const g of Object.values(goals)) {
    const tasks = await prisma.task.findMany({ where: { goalId: g.id }, select: { holat: true } });
    const jami = tasks.length;
    const bajarilgan = tasks.filter((x) => x.holat === "BAJARILDI").length;
    const progress = jami ? Math.round((bajarilgan / jami) * 100) : 0;
    const holat = jami === 0 ? "REJADA" : bajarilgan === jami ? "BAJARILDI" : bajarilgan === 0 ? "REJADA" : "JARAYONDA";
    await prisma.goal.update({ where: { id: g.id }, data: { progress, holat } });
  }

  console.log("Seed muvaffaqiyatli yakunlandi ✅");
}

main()
  .catch((e) => {
    console.error("Seed xatosi:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
