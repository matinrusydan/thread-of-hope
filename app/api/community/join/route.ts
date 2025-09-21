import { prisma } from "@/lib/prisma"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    // Handle both snake_case (from frontend) and camelCase field names
    const fullName = body.fullName || body.full_name
    const email = body.email
    const phone = body.phone
    const age = body.age
    const city = body.city
    const occupation = body.occupation
    const motivation = body.motivation
    const howDidYouHear = body.howDidYouHear || body.how_did_you_hear

    if (!fullName || !email || !age || !city || !motivation || !howDidYouHear) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Check if email already exists
    const existingMember = await prisma.communityMember.findUnique({
      where: { email },
    })

    if (existingMember) {
      return NextResponse.json({ error: "Email already registered" }, { status: 400 })
    }

    const data = await prisma.communityMember.create({
      data: {
        fullName,
        email,
        phone,
        age: Number.parseInt(age),
        city,
        occupation,
        motivation,
        howDidYouHear,
        isApproved: false, // Requires admin approval
      },
    })

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error("Database error:", error)
    return NextResponse.json({ error: "Failed to submit application" }, { status: 500 })
  }
}
