import { NextRequest, NextResponse, userAgent } from "next/server";

export const config = {
  matcher: "/",
};

export function middleware(request: NextRequest) {
  const { device } = userAgent(request);
  const path = device.type === "mobile" ? "/mobile" : "/desktop";
  const url = request.nextUrl.clone();
  console.log(url.pathname);
  url.pathname = path;
  return NextResponse.rewrite(url);
}
