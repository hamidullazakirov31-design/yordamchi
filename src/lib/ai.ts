// AI dvigateli — Google Gemini API bilan javob generatsiyasi.
// Bot foydalanuvchi xabariga bilim bazasi + system prompt asosida javob beradi.

import { env } from "./env";
import { prisma } from "./db";
import { getSystemPrompt, getKnowledgeItems } from "./botConfig";

// Bilim bazasini system prompt uchun matnli kontekstga aylantiradi.
function bilimBazasiMatni(bilimlar: { sarlavha: string; matn: string }[]): string {
  if (bilimlar.length === 0) return "(Bilim bazasi hozircha bo'sh.)";
  return bilimlar.map((b, i) => `${i + 1}. ${b.sarlavha}\n${b.matn}`).join("\n\n");
}

interface GeminiResponse {
  candidates?: {
    content?: { parts?: { text?: string }[] };
    finishReason?: string;
  }[];
  promptFeedback?: { blockReason?: string };
  usageMetadata?: { totalTokenCount?: number };
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

  const model = env.geminiModel;
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${env.geminiApiKey}`;

  const res = await fetch(url, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      system_instruction: { parts: [{ text: systemPrompt }] },
      contents: [{ role: "user", parts: [{ text: userMessage }] }],
      generationConfig: { maxOutputTokens: 2048, temperature: 0.7 },
    }),
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(`Gemini xatosi ${res.status}: ${detail.slice(0, 300)}`);
  }

  const data = (await res.json()) as GeminiResponse;
  const javobMatni = (data.candidates?.[0]?.content?.parts ?? [])
    .map((p) => p.text ?? "")
    .join("")
    .trim();

  const natija =
    javobMatni.length > 0
      ? javobMatni
      : data.promptFeedback?.blockReason
        ? "Kechirasiz, bu savolga javob bera olmayman."
        : "Kechirasiz, hozir javob bera olmadim. Birozdan so'ng qayta urinib ko'ring.";

  // Chaqiruvni jurnalga yozamiz (xato bo'lsa ham javobni to'xtatmaydi).
  await logInteraction({
    telegramId: opts.telegramId,
    kirish: userMessage,
    chiqish: natija,
    model,
    tokenlar: data.usageMetadata?.totalTokenCount ?? 0,
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
