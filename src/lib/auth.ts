// Auth yadrosi — JWT imzolash/tekshirish (jose, edge-mos).
//
// Ikki xil token ishlatiladi, ikkalasi ham AUTH_SECRET bilan imzolanadi,
// lekin "aud" (audience) bo'yicha farqlanadi:
//   - "auth-link"  → bot yuboradigan qisqa muddatli kirish havolasi (5 daqiqa)
//   - "session"    → brauzer cookie'sidagi sessiya (30 kun)

import { SignJWT, jwtVerify } from "jose";

const AUTH_AUD = "auth-link";
const SESSION_AUD = "session";
export const SESSION_COOKIE = "yordamchi_session";

export interface AuthUser {
  telegramId: string;
  username?: string;
  ism?: string;
}

function secretKey(): Uint8Array {
  const secret = process.env.AUTH_SECRET;
  if (!secret) throw new Error("AUTH_SECRET topilmadi");
  return new TextEncoder().encode(secret);
}

async function sign(user: AuthUser, aud: string, expires: string): Promise<string> {
  return new SignJWT({ username: user.username, ism: user.ism })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(user.telegramId)
    .setAudience(aud)
    .setIssuedAt()
    .setExpirationTime(expires)
    .sign(secretKey());
}

async function verify(token: string, aud: string): Promise<AuthUser> {
  const { payload } = await jwtVerify(token, secretKey(), { audience: aud });
  return {
    telegramId: String(payload.sub),
    username: payload.username as string | undefined,
    ism: payload.ism as string | undefined,
  };
}

// Bot mint qiladigan qisqa muddatli kirish tokeni
export function signAuthLink(user: AuthUser): Promise<string> {
  return sign(user, AUTH_AUD, "5m");
}
export function verifyAuthLink(token: string): Promise<AuthUser> {
  return verify(token, AUTH_AUD);
}

// Brauzer sessiyasi
export function signSession(user: AuthUser): Promise<string> {
  return sign(user, SESSION_AUD, "30d");
}
export function verifySession(token: string): Promise<AuthUser> {
  return verify(token, SESSION_AUD);
}
