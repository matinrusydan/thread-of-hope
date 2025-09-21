import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { type NextRequest, NextResponse } from "next/server"

export const dynamic = 'force-dynamic'

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== 'admin') {
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