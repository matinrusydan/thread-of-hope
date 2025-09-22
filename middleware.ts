import { NextResponse } from "next/server"

export function middleware(req) {
  // Semua halaman public, tidak ada proteksi NextAuth
  return NextResponse.next()
}

export const config = {
  matcher: [
    // ...existing code...
    "/((?!_next/static|_next/image|favicon.ico|.*.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}
