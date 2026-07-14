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
  get allowedTelegramId() {
    return req("ALLOWED_TELEGRAM_ID");
  },
  get authSecret() {
    return req("AUTH_SECRET");
  },
  get webhookSecret() {
    return req("TELEGRAM_WEBHOOK_SECRET");
  },
  get appUrl() {
    return process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  },
  get botUsername() {
    return process.env.NEXT_PUBLIC_BOT_USERNAME ?? "";
  },
};
