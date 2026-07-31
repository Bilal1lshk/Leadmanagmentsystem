import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function proxy(request: NextRequest) {
  const cookie = request.cookies
  console.log(cookie)
  if (request.nextUrl.pathname.endsWith('/create')) {
    return NextResponse.json("working")
  }

  if (request.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.rewrite(new URL('/dashboard/user', request.url))
  }
}