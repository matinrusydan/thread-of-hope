import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { type NextRequest, NextResponse } from "next/server"

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "12")
    const upcoming = searchParams.get("upcoming") === "true"

    const skip = (page - 1) * limit

    const where: any = {}
    if (upcoming) {
      where.eventDate = {
        gte: new Date()
      }
    }

    const [data, total] = await Promise.all([
      prisma.event.findMany({
        where,
        orderBy: { eventDate: "asc" },
        skip,
        take: limit,
      }),
      prisma.event.count({ where }),
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
    return NextResponse.json({ error: "Failed to fetch events" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { title, description, eventDate, location, imagePath, isFeatured } = body

    if (!title || !eventDate) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const data = await prisma.event.create({
      data: {
        title,
        description,
        eventDate: new Date(eventDate),
        location,
        imagePath,
        isFeatured: isFeatured || false,
      },
    })

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error("Database error:", error)
    return NextResponse.json({ error: "Failed to create event" }, { status: 500 })
  }
}