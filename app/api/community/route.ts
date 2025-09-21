import { prisma } from "@/lib/prisma"
import { type NextRequest, NextResponse } from "next/server"

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "50")

    const skip = (page - 1) * limit

    const [members, total] = await Promise.all([
      prisma.communityMember.findMany({
        orderBy: { joinedAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.communityMember.count(),
    ])

    return NextResponse.json({
      data: members,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Database error:", error)
    return NextResponse.json({ error: "Failed to fetch members" }, { status: 500 })
  }
}