import { prisma } from "@/lib/prisma"
import { cookies } from "next/headers"
import { type NextRequest, NextResponse } from "next/server"

export const dynamic = 'force-dynamic'

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const cookieStore = cookies()
    const adminSession = cookieStore.get("admin_session")?.value
    if (!adminSession) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    const user = await prisma.user.findUnique({ where: { id: adminSession } })
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { isApproved } = body

    if (typeof isApproved !== 'boolean') {
      return NextResponse.json({ error: "Invalid approval status" }, { status: 400 })
    }

    const member = await prisma.communityMember.update({
      where: { id: params.id },
      data: { isApproved },
    })

    return NextResponse.json({ success: true, data: member })
  } catch (error) {
    console.error("Database error:", error)
    return NextResponse.json({ error: "Failed to update member" }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const cookieStore = cookies()
    const adminSession = cookieStore.get("admin_session")?.value
    if (!adminSession) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    const user = await prisma.user.findUnique({ where: { id: adminSession } })
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await prisma.communityMember.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Database error:", error)
    return NextResponse.json({ error: "Failed to delete member" }, { status: 500 })
  }
}