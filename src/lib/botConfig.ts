// Bot sozlamalari — system prompt va bilim bazasini bazadan o'qish/yozish.
// Ham AI dvigateli (ai.ts), ham /bot boshqaruv sahifasi shu yordamchilardan foydalanadi.

import { prisma } from "./db";

// Sozlama qatori topilmasa ishlatiladigan standart "o'zini tutish" qoidasi.
export const DEFAULT_SYSTEM_PROMPT = `Sen "Yordamchi" — o'zbek tilida so'zlashadigan shaxsiy AI yordamchisan.
Vazifang: foydalanuvchining savollariga sizga berilgan bilim bazasi va qoidalarga
tayangan holda aniq, qisqa va foydali javob berish.

Qoidalar:
- Har doim o'zbek tilida, samimiy va hurmatli ohangda javob ber.
- Avvalo quyidagi bilim bazasidagi ma'lumotlarga tayan.
- Agar javob bilim bazasida bo'lmasa, buni ochiq ayt va taxmin qilib yuborma.
- Javobni qisqa va tushunarli qilib ber.`;

export const BOT_CONFIG_ID = "default";

// Joriy system prompt'ni qaytaradi. Baza xatosi yoki qator yo'qligida —
// standart qoidaga qaytadi (bot ishlashdan to'xtamasligi uchun).
export async function getSystemPrompt(): Promise<string> {
  try {
    const cfg = await prisma.botConfig.findUnique({
      where: { id: BOT_CONFIG_ID },
    });
    const matn = cfg?.systemPrompt?.trim();
    return matn && matn.length > 0 ? matn : DEFAULT_SYSTEM_PROMPT;
  } catch (e) {
    console.error("getSystemPrompt xatosi, standart qoida ishlatiladi:", e);
    return DEFAULT_SYSTEM_PROMPT;
  }
}

// System prompt'ni saqlaydi (upsert — bitta "default" qator).
export async function saveSystemPrompt(systemPrompt: string): Promise<void> {
  await prisma.botConfig.upsert({
    where: { id: BOT_CONFIG_ID },
    update: { systemPrompt },
    create: { id: BOT_CONFIG_ID, systemPrompt },
  });
}

export interface Bilim {
  id: string;
  sarlavha: string;
  matn: string;
  faol: boolean;
}

// Bilim bazasi yozuvlari. onlyActive=true bo'lsa faqat faol yozuvlar.
export async function getKnowledgeItems(onlyActive = false): Promise<Bilim[]> {
  try {
    const items = await prisma.knowledgeItem.findMany({
      where: onlyActive ? { faol: true } : undefined,
      orderBy: { yaratilganSana: "desc" },
    });
    return items.map((i) => ({
      id: i.id,
      sarlavha: i.sarlavha,
      matn: i.matn,
      faol: i.faol,
    }));
  } catch (e) {
    console.error("getKnowledgeItems xatosi, bo'sh ro'yxat qaytadi:", e);
    return [];
  }
}
