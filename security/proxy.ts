import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const url = req.nextUrl;

  // Protect only API routes
  if (url.pathname.startsWith("/api")) {

    // Anti-XSS query
    for (const v of url.searchParams.values()) {
      if (/<|>|script|javascript:/gi.test(v)) {
        return new NextResponse("Blocked: XSS detected.", { status: 400 });
      }
    }

    // Allow only internal calls
    const referer = req.headers.get("referer") || "";
    if (!referer.includes(url.origin)) {
      return new NextResponse("Blocked: External API calls not allowed.", {
        status: 401,
      });
    }

    // Simple server-side rate limit for API
    const ip = req.headers.get("x-forwarded-for") || "0.0.0.0";
    const key = `api-rl-${ip}`;
    const now = Date.now();

    const prev = globalThis[key] || { count: 0, time: now };
    if (now - prev.time > 60000) {
      globalThis[key] = { count: 1, time: now };
    } else {
      if (prev.count >= 60) {
        return new NextResponse("Rate Limit Exceeded.", { status: 429 });
      }
      prev.count++;
      globalThis[key] = prev;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/api/:path*",
};
