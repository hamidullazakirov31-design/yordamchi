// Muhit o'zgaruvchilarini bir joyda o'qish. Server tomonida ishlaydi.

function req(name: string): string {
  const v = process.env[name];
  if (!v) {
    // Build vaqtida yo'q bo'lishi mumkin; runtime'da chaqirilganda talab qilinadi.
    throw new Error(`Muhit o'zgaruvchisi topilmadi: ${name}`);
  }
  return v;
}

export const env = {
  get botToken() {
    return req("TELEGRAM_BOT_TOKEN");
  },
  // Maxfiy emas — kodda default bor, lekin env orqali almashtirish mumkin
  get allowedTelegramId() {
    return process.env.ALLOWED_TELEGRAM_ID ?? "1271615246";
  },
  get appUrl() {
    return process.env.NEXT_PUBLIC_APP_URL ?? "https://yordamchi-dusky.vercel.app";
  },
  get botUsername() {
    return process.env.NEXT_PUBLIC_BOT_USERNAME ?? "zxi540bot";
  },
  // Maxfiy — Vercel env'da bo'lishi SHART
  get authSecret() {
    return req("AUTH_SECRET");
  },
  get webhookSecret() {
    return req("TELEGRAM_WEBHOOK_SECRET");
  },
};
