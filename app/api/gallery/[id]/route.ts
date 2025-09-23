import { prisma } from "@/lib/prisma"
import { cookies } from "next/headers"
import { type NextRequest, NextResponse } from "next/server"

export const dynamic = 'force-dynamic'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const galleryItem = await prisma.gallery.findUnique({
      where: { id: params.id },
    })

    if (!galleryItem) {
      return NextResponse.json({ error: "Gallery item not found" }, { status: 404 })
    }

    return NextResponse.json(galleryItem)
  } catch (error) {
    console.error("Database error:", error)
    return NextResponse.json({ error: "Failed to fetch gallery item" }, { status: 500 })
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

    await prisma.gallery.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Database error:", error)
    return NextResponse.json({ error: "Failed to delete gallery item" }, { status: 500 })
  }
}