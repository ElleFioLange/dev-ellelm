import { NextRequest, NextResponse, userAgent } from "next/server";

export const config = {
  matcher: ["/", "/portfolio"],
};

export function middleware(request: NextRequest) {
  const { device } = userAgent(request);
  const path = device.type === "mobile" ? "mobile" : "desktop";
  const url = request.nextUrl.clone();
  // Add slash conditionally
  if (url.pathname !== "/") url.pathname += "/";
  url.pathname += path;
  return NextResponse.rewrite(url);
}
