import { NextResponse } from "next/server"
import { serialize } from "cookie"

export async function POST() {
  // Clear the admin_session cookie by setting it expired
  const cookie = serialize("admin_session", "", {
    path: "/",
    httpOnly: true,
    maxAge: 0, // Expire immediately
  })

  const res = NextResponse.json({ success: true })
  res.headers.set("Set-Cookie", cookie)
  return res
}