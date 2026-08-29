import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
export function proxy(request) {
    const token = request.cookies.get("token")?.value;
    if (!token) {
        return NextResponse.redirect(new URL("/login", request.url));
    }
    // Route handlers verify the JWT and membership before accessing data.
    // Proxy only performs the inexpensive navigation gate.
    return NextResponse.next();
}

export const config = {
    matcher: [
        "/dashboard/:path*",
    ],
};
