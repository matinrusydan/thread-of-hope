import { prisma } from "@/lib/prisma"
import { type NextRequest, NextResponse } from "next/server"

interface RouteParams {
  params: Promise<{ id: string }>
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params
    const { searchParams } = new URL(request.url)
    const isAdmin = searchParams.get("admin") === "true"

    const ebook = await prisma.ebook.findFirst({
      where: {
        id,
        ...(isAdmin ? {} : { isPublished: true }), // Only filter by published for non-admin requests
      },
    })

    if (!ebook) {
      return NextResponse.json({ error: "E-book not found" }, { status: 404 })
    }

    return NextResponse.json({ data: ebook })
  } catch (error) {
    console.error("Database error:", error)
    return NextResponse.json({ error: "Failed to fetch ebook" }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params
    const body = await request.json()
    const { isPublished, isFeatured, title, description, author, category, coverImagePath, externalUrl } = body

    const ebook = await prisma.ebook.update({
      where: { id },
      data: {
        ...(isPublished !== undefined && { isPublished }),
        ...(isFeatured !== undefined && { isFeatured }),
        ...(title && { title }),
        ...(description && { description }),
        ...(author && { author }),
        ...(category && { category }),
        ...(coverImagePath && { coverImagePath }),
        ...(externalUrl && { externalUrl })
      },
    })

    return NextResponse.json({ success: true, data: ebook })
  } catch (error) {
    console.error("Database error:", error)
    return NextResponse.json({ error: "Failed to update ebook" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params

    await prisma.ebook.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Database error:", error)
    return NextResponse.json({ error: "Failed to delete ebook" }, { status: 500 })
  }
}