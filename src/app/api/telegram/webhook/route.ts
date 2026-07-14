// Telegram webhook endpoint'i. Telegram yangilanishlarni shu manzilga yuboradi.
// Webhook 'secret_token' orqali himoyalangan (getWebhookHandler ichida tekshiriladi).

import { getWebhookHandler } from "@/lib/telegram";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request): Promise<Response> {
  const handler = getWebhookHandler();
  return handler(req);
}
