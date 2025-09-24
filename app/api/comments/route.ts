import { prisma } from "@/lib/prisma"
import { type NextRequest, NextResponse } from "next/server"

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const approved = searchParams.get("approved")

    const skip = (page - 1) * limit

    const where = approved !== undefined ? { isApproved: approved === "true" } : {}

    const [comments, total] = await Promise.all([
      prisma.comment.findMany({
        where,
        include: {
          curhat: {
            select: {
              id: true,
              title: true,
              authorName: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.comment.count({ where }),
    ])

    return NextResponse.json({
      data: comments,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Database error:", error)
    return NextResponse.json({ error: "Failed to fetch comments" }, { status: 500 })
  }
}