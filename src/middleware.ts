// Route himoyasi — faqat yaroqli sessiyaga ega foydalanuvchi ilova sahifalariga kiradi.

import { NextRequest, NextResponse } from "next/server";
import { verifySession, SESSION_COOKIE } from "@/lib/auth";

// Himoyalangan sahifa prefikslari
const PROTECTED = ["/goals", "/tasks", "/kun-tahlili", "/ai-xulosasi", "/bot", "/dashboard"];

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
  if (PROTECTED.some((p) => pathname === p || pathname.startsWith(p + "/")) && !valid) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  // Allaqachon kirgan bo'lsa — login sahifasidan maqsadlarga
  if (pathname === "/login" && valid) {
    const url = req.nextUrl.clone();
    url.pathname = "/goals";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/goals/:path*",
    "/tasks/:path*",
    "/kun-tahlili/:path*",
    "/ai-xulosasi/:path*",
    "/bot/:path*",
    "/dashboard/:path*",
    "/login",
  ],
};
