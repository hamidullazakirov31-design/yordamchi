// AI dvigateli — Anthropic Claude API bilan javob generatsiyasi.
// Bot foydalanuvchi xabariga bilim bazasi + system prompt asosida javob beradi.

import Anthropic from "@anthropic-ai/sdk";
import { env } from "./env";
import { prisma } from "./db";
import { getSystemPrompt, getKnowledgeItems } from "./botConfig";

let clientSingleton: Anthropic | null = null;

function getClient(): Anthropic {
  if (!clientSingleton) {
    clientSingleton = new Anthropic({ apiKey: env.anthropicApiKey });
  }
  return clientSingleton;
}

// Bilim bazasini system prompt uchun matnli kontekstga aylantiradi.
function bilimBazasiMatni(bilimlar: { sarlavha: string; matn: string }[]): string {
  if (bilimlar.length === 0) return "(Bilim bazasi hozircha bo'sh.)";
  return bilimlar.map((b, i) => `${i + 1}. ${b.sarlavha}\n${b.matn}`).join("\n\n");
}

// Foydalanuvchi xabariga to'liq system prompt (qoidalar + bilim bazasi) asosida
// AI javobini qaytaradi. Har bir chaqiruv AIInteraction jurnaliga yoziladi.
export async function generateAiReply(
  userMessage: string,
  opts: { telegramId?: string } = {}
): Promise<string> {
  const [qoidalar, bilimlar] = await Promise.all([
    getSystemPrompt(),
    getKnowledgeItems(true),
  ]);

  const systemPrompt = `${qoidalar}

===== BILIM BAZASI =====
Quyidagi ma'lumotlar sening asosiy manbang. Javoblaringni shularga tayangan
holda ber:

${bilimBazasiMatni(bilimlar)}
===== BILIM BAZASI TUGADI =====`;

  const client = getClient();

  const response = await client.messages.create({
    model: env.aiModel,
    max_tokens: 1024,
    system: systemPrompt,
    messages: [{ role: "user", content: userMessage }],
  });

  const javob = response.content
    .filter((b): b is Anthropic.TextBlock => b.type === "text")
    .map((b) => b.text)
    .join("\n")
    .trim();

  const natija =
    javob.length > 0
      ? javob
      : "Kechirasiz, hozir javob bera olmadim. Birozdan so'ng qayta urinib ko'ring.";

  // Chaqiruvni jurnalga yozamiz (xato bo'lsa ham javobni to'xtatmaydi).
  await logInteraction({
    telegramId: opts.telegramId,
    kirish: userMessage,
    chiqish: natija,
    model: response.model,
    tokenlar:
      (response.usage?.input_tokens ?? 0) + (response.usage?.output_tokens ?? 0),
  }).catch((e) => console.error("AIInteraction yozish xatosi:", e));

  return natija;
}

// AI chaqiruvini AIInteraction jadvaliga yozadi (foydalanuvchi topilsa).
async function logInteraction(p: {
  telegramId?: string;
  kirish: string;
  chiqish: string;
  model: string;
  tokenlar: number;
}): Promise<void> {
  if (!p.telegramId) return;
  const user = await prisma.user.findUnique({
    where: { telegramId: BigInt(p.telegramId) },
    select: { id: true },
  });
  if (!user) return;
  await prisma.aIInteraction.create({
    data: {
      userId: user.id,
      tur: "telegram_chat",
      kirishKontekst: p.kirish,
      chiqishNatija: p.chiqish,
      model: p.model,
      tokenlar: p.tokenlar,
    },
  });
}
