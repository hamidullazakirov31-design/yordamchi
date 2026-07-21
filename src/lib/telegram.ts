// Telegram bot (grammY) — deep-link avtorizatsiya oqimi.
//
// Oqim:
//  1. Foydalanuvchi web'dagi tugmani bosadi → https://t.me/<bot>?start=login
//  2. Bot /start login xabarini oladi.
//  3. Agar yuboruvchi ID ruxsat etilgan ID bo'lsa → imzolangan kirish havolasi beriladi.
//  4. Aks holda → rad etiladi.

import { Bot, InlineKeyboard, webhookCallback } from "grammy";
import { env } from "./env";
import { signAuthLink } from "./auth";
import { generateAiReply } from "./ai";

let botSingleton: Bot | null = null;

export function getBot(): Bot {
  if (botSingleton) return botSingleton;

  const bot = new Bot(env.botToken);

  bot.command("start", async (ctx) => {
    const fromId = ctx.from?.id;
    if (!fromId) return;

    // Faqat ruxsat etilgan foydalanuvchi(lar)
    if (!env.isAllowed(fromId)) {
      await ctx.reply(
        "⛔ Kechirasiz, bu shaxsiy yordamchi. Sizga kirishga ruxsat berilmagan."
      );
      return;
    }

    const token = await signAuthLink({
      telegramId: String(fromId),
      username: ctx.from?.username,
      ism: [ctx.from?.first_name, ctx.from?.last_name].filter(Boolean).join(" "),
    });

    const url = `${env.appUrl}/api/auth/callback?token=${token}`;
    const keyboard = new InlineKeyboard().url("🚀 Ilovaga kirish", url);

    await ctx.reply(
      "✅ Shaxsingiz tasdiqlandi!\n\nQuyidagi tugma orqali ilovaga kiring (havola 5 daqiqa amal qiladi):",
      { reply_markup: keyboard }
    );
  });

  // Matnli xabar — AI yordamchisi bilim bazasi + system prompt asosida javob beradi.
  bot.on("message:text", async (ctx) => {
    const fromId = ctx.from?.id;

    // Faqat ruxsat etilgan foydalanuvchi(lar) AI javobini oladi (shaxsiy yordamchi).
    if (!fromId || !env.isAllowed(fromId)) {
      await ctx.reply(
        "⛔ Kechirasiz, bu shaxsiy yordamchi. Sizga javob berishga ruxsat berilmagan."
      );
      return;
    }

    try {
      await ctx.replyWithChatAction("typing"); // "yozmoqda..." holati
      const javob = await generateAiReply(ctx.message.text, {
        telegramId: String(fromId),
      });
      await ctx.reply(javob);
    } catch (e) {
      console.error("AI javob xatosi:", e);
      await ctx.reply(
        "⚠️ Javob tayyorlashda xatolik yuz berdi. Birozdan so'ng qayta urinib ko'ring."
      );
    }
  });

  // Matnsiz xabarlar (rasm, stiker va h.k.).
  bot.on("message", async (ctx) => {
    await ctx.reply(
      "Iltimos, savolingizni matn ko'rinishida yozing — men shunga javob beraman."
    );
  });

  botSingleton = bot;
  return bot;
}

// Next.js API route uchun webhook ishlovchisi
export function getWebhookHandler() {
  return webhookCallback(getBot(), "std/http", {
    secretToken: env.webhookSecret,
  });
}
