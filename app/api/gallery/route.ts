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
    const category = searchParams.get("category")

    const skip = (page - 1) * limit

    const where: any = {}
    if (category && category !== "all") {
      where.category = category
    }

    const [data, total] = await Promise.all([
      prisma.gallery.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.gallery.count({ where }),
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
    return NextResponse.json({ error: "Failed to fetch gallery items" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { title, description, imagePath, category } = body

    if (!title || !imagePath) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const data = await prisma.gallery.create({
      data: {
        title,
        description,
        imagePath,
        category: category || "general",
        isFeatured: false,
      },
    })

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error("Database error:", error)
    return NextResponse.json({ error: "Failed to create gallery item" }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { id, title, description, imagePath, category, isFeatured } = body

    if (!id || !title) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const data = await prisma.gallery.update({
      where: { id },
      data: {
        title,
        description,
        imagePath,
        category: category || "general",
        isFeatured: isFeatured || false,
      },
    })

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error("Database error:", error)
    return NextResponse.json({ error: "Failed to update gallery item" }, { status: 500 })
  }
}