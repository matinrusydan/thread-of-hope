import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const body = await request.json()
    const { content, authorName } = body

    if (!content || content.trim() === "") {
      return NextResponse.json({ error: "Content is required" }, { status: 400 })
    }

    const curhat = await prisma.curhat.findUnique({
      where: { id },
    })

    if (!curhat) {
      return NextResponse.json({ error: "Curhat not found" }, { status: 404 })
    }

    const comment = await prisma.comment.create({
      data: {
        content: content.trim(),
        authorName: authorName || null, // null for anonymous
        curhatId: id,
        isApproved: false, // requires admin approval
      },
    })

    return NextResponse.json({ success: true, comment })
  } catch (error) {
    console.error("Error posting comment:", error)
    return NextResponse.json({ error: "Failed to post comment" }, { status: 500 })
  }
}