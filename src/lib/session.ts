// Server tomonida joriy foydalanuvchini aniqlash.
// Sessiya cookie'sini tekshiradi va DB'dagi User yozuvini qaytaradi (id bilan).

import { cookies } from "next/headers";
import { verifySession, SESSION_COOKIE, type AuthUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import type { User } from "@prisma/client";

// Sessiyadagi foydalanuvchini (JWT payload) qaytaradi yoki null.
export async function getSessionUser(): Promise<AuthUser | null> {
  const token = cookies().get(SESSION_COOKIE)?.value;
  if (!token) return null;
  try {
    return await verifySession(token);
  } catch {
    return null;
  }
}

// DB'dagi User yozuvini qaytaradi (yo'q bo'lsa yaratadi). Sessiya bo'lmasa null.
export async function getDbUser(): Promise<User | null> {
  const authUser = await getSessionUser();
  if (!authUser) return null;

  const telegramId = BigInt(authUser.telegramId);
  return prisma.user.upsert({
    where: { telegramId },
    update: {},
    create: {
      telegramId,
      telegramUser: authUser.username ?? null,
      ism: authUser.ism ?? null,
    },
  });
}
