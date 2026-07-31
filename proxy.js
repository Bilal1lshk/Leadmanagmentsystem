import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";
export function proxy(NextRequest) {
    const token = NextRequest.cookies.get("token")?.value;
    const data = jwt.verify(token, process.env.JWT_SECRET)
    const requestHeaders = new Headers(NextRequest.headers);
    requestHeaders.set("userId", data?.userId)
    console.log(data?.userId, requestHeaders);
    return NextResponse.next({
      request:{
        headers:requestHeaders
      }
    });
}

export const config = {
    matcher: [
        "/dashboard/:path*",
    ],
};