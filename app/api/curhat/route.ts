import { prisma } from "@/lib/prisma"
import { type NextRequest, NextResponse } from "next/server"

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { nama, usia, harapan, cerita } = body

    if (!nama || !usia || !harapan || !cerita) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 })
    }

    const data = await prisma.curhat.create({
      data: {
        title: harapan,
        content: cerita,
        authorName: nama,
        isApproved: false, // Requires admin approval
      },
    })

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error("Database error:", error)
    return NextResponse.json({ error: "Failed to submit story" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const approved = searchParams.get("approved") !== "false"

    const skip = (page - 1) * limit

    const [data, total] = await Promise.all([
      prisma.curhat.findMany({
        where: approved ? { isApproved: true } : {},
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.curhat.count({
        where: approved ? { isApproved: true } : {},
      }),
    ])

    return NextResponse.json({
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Database error:", error)
    return NextResponse.json({ error: "Failed to fetch stories" }, { status: 500 })
  }
}
