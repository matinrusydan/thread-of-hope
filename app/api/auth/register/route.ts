import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    console.log("🔄 Registration attempt started")

    // Parse request body with error handling
    let body
    try {
      body = await request.json()
    } catch (parseError) {
      console.error("❌ JSON parse error:", parseError)
      return NextResponse.json(
        { error: "Invalid JSON in request body" },
        { status: 400 }
      )
    }

    const { email, password } = body

    // Validate input
    if (!email || !password) {
      console.log("❌ Missing email or password")
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      )
    }

    if (typeof email !== 'string' || typeof password !== 'string') {
      console.log("❌ Invalid email or password type")
      return NextResponse.json(
        { error: "Email and password must be strings" },
        { status: 400 }
      )
    }

    if (password.length < 6) {
      console.log("❌ Password too short")
      return NextResponse.json(
        { error: "Password must be at least 6 characters" },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      console.log("❌ Invalid email format")
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      )
    }

    console.log("🔍 Checking for existing user...")

    // Check if user already exists with error handling
    let existingUser
    try {
      existingUser = await prisma.user.findUnique({
        where: { email: email.toLowerCase() },
      })
    } catch (dbError) {
      console.error("❌ Database error during user lookup:", dbError)
      return NextResponse.json(
        { error: "Database error during user lookup" },
        { status: 500 }
      )
    }

    if (existingUser) {
      console.log("❌ User already exists")
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      )
    }

    console.log("🔐 Hashing password...")

    // Hash password with error handling
    let hashedPassword
    try {
      hashedPassword = await bcrypt.hash(password, 12)
    } catch (hashError) {
      console.error("❌ Password hashing error:", hashError)
      return NextResponse.json(
        { error: "Password processing error" },
        { status: 500 }
      )
    }

    console.log("💾 Creating user in database...")

    // Create user with error handling
    let user
    try {
      user = await prisma.user.create({
        data: {
          email: email.toLowerCase(),
          password: hashedPassword,
        },
        select: {
          id: true,
          email: true,
          createdAt: true
        }
      })
    } catch (createError) {
      console.error("❌ User creation error:", createError)
      return NextResponse.json(
        { error: "Failed to create user account" },
        { status: 500 }
      )
    }

    console.log("✅ User created successfully:", user.id)

    return NextResponse.json({
      message: "User created successfully",
      user: {
        id: user.id,
        email: user.email,
        createdAt: user.createdAt
      }
    })

  } catch (error) {
    console.error("💥 Unexpected registration error:", error)

    // Handle specific Prisma errors
    if (error && typeof error === 'object' && 'code' in error) {
      const prismaError = error as any

      if (prismaError.code === 'P1001') {
        return NextResponse.json(
          { error: "Database connection failed" },
          { status: 500 }
        )
      }

      if (prismaError.code === 'P2002') {
        return NextResponse.json(
          { error: "User already exists" },
          { status: 400 }
        )
      }
    }

    return NextResponse.json(
      {
        error: "Internal server error",
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
}