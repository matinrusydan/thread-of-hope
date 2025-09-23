import { prisma } from "@/lib/prisma"
import { cookies } from "next/headers"
import { type NextRequest, NextResponse } from "next/server"

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "12")
    const category = searchParams.get("category")
    const published = searchParams.get("published") !== "false"

    const skip = (page - 1) * limit

    const where: any = {}
    if (published) {
      where.isPublished = true
    }
    if (category && category !== "all") {
      where.category = category
    }

    const [data, total] = await Promise.all([
      prisma.ebook.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.ebook.count({ where }),
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
    return NextResponse.json({ error: "Failed to fetch ebooks" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const cookieStore = cookies();
    const adminSession = cookieStore.get("admin_session")?.value;
    if (!adminSession) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const user = await prisma.user.findUnique({ where: { id: adminSession } });
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json()
    const { title, description, author, category, coverImagePath, externalUrl } = body

    if (!title || !description || !author || !category || !externalUrl) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const data = await prisma.ebook.create({
      data: {
        title,
        description,
        author,
        category,
        coverImagePath,
        externalUrl,
        isPublished: false,
        viewCount: 0,
      },
    })

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error("Database error:", error)
    return NextResponse.json({ error: "Failed to create ebook" }, { status: 500 })
  }
}
