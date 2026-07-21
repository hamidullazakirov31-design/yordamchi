// Prisma client singleton — serverless muhitda ulanishlar ko'payib ketmasligi uchun.

import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

// Serverless (Vercel) + Neon muhitida ulanish parametrlari.
// - connection_limit=1: har bir funksiya instansiyasi bitta ulanish ishlatadi
//   (ulanishlar tugab, so'rovlar navbatda osilib qolmasligi uchun).
// - connect_timeout / pool_timeout: baza javob bermasa cheksiz kutmasdan tez
//   xato bersin — foydalanuvchi cheksiz "Yuklanmoqda..." o'rniga aniq xato ko'radi.
function datasourceUrl(): string | undefined {
  const base = process.env.DATABASE_URL;
  if (!base) return undefined;
  try {
    const u = new URL(base);
    if (!u.searchParams.has("connection_limit"))
      u.searchParams.set("connection_limit", "1");
    if (!u.searchParams.has("connect_timeout"))
      u.searchParams.set("connect_timeout", "8");
    if (!u.searchParams.has("pool_timeout"))
      u.searchParams.set("pool_timeout", "8");
    return u.toString();
  } catch {
    return base;
  }
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({ datasourceUrl: datasourceUrl() });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
