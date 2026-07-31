import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  try {
    console.log("Proxy running:", request.nextUrl.pathname);
    return NextResponse.next();
  }
  catch (err) {
    return NextResponse.error();
  }
}

export const config = {
  matcher: [
    "/dashboard/:path*",
  ],
};