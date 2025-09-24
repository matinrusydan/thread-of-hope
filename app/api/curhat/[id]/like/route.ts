import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const body = await request.json()
    const { clientId } = body

    if (!clientId) {
      return NextResponse.json({ error: "Client ID required" }, { status: 400 })
    }

    const curhat = await prisma.curhat.findUnique({
      where: { id },
    })

    if (!curhat) {
      return NextResponse.json({ error: "Curhat not found" }, { status: 404 })
    }

    // Check if user already liked this post
    const existingLike = await prisma.curhatLike.findUnique({
      where: {
        curhatId_clientId: {
          curhatId: id,
          clientId,
        },
      },
    })

    if (existingLike) {
      // Unlike: remove the like
      await prisma.curhatLike.delete({
        where: { id: existingLike.id },
      })
    } else {
      // Like: add the like
      await prisma.curhatLike.create({
        data: {
          curhatId: id,
          clientId,
        },
      })
    }

    // Get updated like count
    const likeCount = await prisma.curhatLike.count({
      where: { curhatId: id },
    })

    return NextResponse.json({
      success: true,
      likes: likeCount,
      isLiked: !existingLike
    })
  } catch (error) {
    console.error("Error toggling like:", error)
    return NextResponse.json({ error: "Failed to toggle like" }, { status: 500 })
  }
}