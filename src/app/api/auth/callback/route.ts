// Bot yuborgan kirish havolasi shu yerga tushadi.
// Tokenni tekshiradi, sessiya cookie'sini o'rnatadi va dashboard'ga yo'naltiradi.

import { NextRequest, NextResponse } from "next/server";
import { verifyAuthLink, signSession, SESSION_COOKIE } from "@/lib/auth";
import { prisma } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest): Promise<NextResponse> {
  const token = req.nextUrl.searchParams.get("token");

  const redirectTo = (path: string) => {
    const url = req.nextUrl.clone();
    url.pathname = path;
    url.search = "";
    return url;
  };

  if (!token) {
    const url = redirectTo("/login");
    url.searchParams.set("error", "notoken");
    return NextResponse.redirect(url);
  }

  try {
    const user = await verifyAuthLink(token);

    // Foydalanuvchini bazaga yozamiz (yoki yangilaymiz). DB xatosi login'ni to'xtatmasin.
    try {
      await prisma.user.upsert({
        where: { telegramId: BigInt(user.telegramId) },
        update: { telegramUser: user.username ?? null, ism: user.ism ?? null },
        create: {
          telegramId: BigInt(user.telegramId),
          telegramUser: user.username ?? null,
          ism: user.ism ?? null,
        },
      });
    } catch (e) {
      console.error("User upsert xatosi (login davom etadi):", e);
    }

    const session = await signSession(user);

    const res = NextResponse.redirect(redirectTo("/dashboard"));
    res.cookies.set(SESSION_COOKIE, session, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 30, // 30 kun
    });
    return res;
  } catch {
    const url = redirectTo("/login");
    url.searchParams.set("error", "invalid");
    return NextResponse.redirect(url);
  }
}
