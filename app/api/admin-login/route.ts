import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { NextRequest, NextResponse } from "next/server"
import { serialize } from "cookie"

export async function POST(request: NextRequest) {
  const { email, password } = await request.json()
  if (!email || !password) {
    return NextResponse.json({ error: "Email dan password wajib diisi" }, { status: 400 })
  }

  const user = await prisma.user.findUnique({ where: { email } })
  if (!user || user.role !== "admin" || !user.password) {
    return NextResponse.json({ error: "Email atau password salah" }, { status: 401 })
  }

  const isValid = await bcrypt.compare(password, user.password)
  if (!isValid) {
    return NextResponse.json({ error: "Email atau password salah" }, { status: 401 })
  }

  // Set session cookie (simple, for demo; use JWT for production)
  const cookie = serialize("admin_session", user.id, {
    path: "/",
    httpOnly: true,
    maxAge: 60 * 60 * 24, // 1 day
  })

  const res = NextResponse.json({ success: true })
  res.headers.set("Set-Cookie", cookie)
  return res
}
