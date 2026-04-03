import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  if (request.nextUrl.pathname === "/") {
    // x-cache-status lets us verify caching behaviour via curl or DevTools
    // Cache-Control is set in next.config.ts to avoid duplication
    response.headers.set("x-cache-status", "MISS");
  }

  return response;
}

export const config = {
  matcher: "/",
};
