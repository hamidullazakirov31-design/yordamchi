// Route himoyasi — faqat yaroqli sessiyaga ega foydalanuvchi /dashboard'ga kiradi.

import { NextRequest, NextResponse } from "next/server";
import { verifySession, SESSION_COOKIE } from "@/lib/auth";

export async function middleware(req: NextRequest): Promise<NextResponse> {
  const token = req.cookies.get(SESSION_COOKIE)?.value;

  let valid = false;
  if (token) {
    try {
      await verifySession(token);
      valid = true;
    } catch {
      valid = false;
    }
  }

  const { pathname } = req.nextUrl;

  // Himoyalangan sahifa — sessiya bo'lmasa login'ga
  if (pathname.startsWith("/dashboard") && !valid) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  // Allaqachon kirgan bo'lsa — login sahifasidan dashboard'ga
  if (pathname === "/login" && valid) {
    const url = req.nextUrl.clone();
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/login"],
};
