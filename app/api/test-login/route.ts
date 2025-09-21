import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function GET() {
  try {
    // Check if admin user exists
    const adminUser = await prisma.user.findUnique({
      where: { email: 'admin@threadofhope.com' }
    })

    if (!adminUser) {
      return NextResponse.json({
        status: 'error',
        message: 'Admin user not found',
        suggestion: 'Run admin seeding first'
      }, { status: 404 })
    }

    // Test password verification
    const testPassword = 'rikariyani9173'
    const isPasswordValid = adminUser.password
      ? await bcrypt.compare(testPassword, adminUser.password)
      : false

    return NextResponse.json({
      status: 'success',
      adminUser: {
        id: adminUser.id,
        email: adminUser.email,
        name: adminUser.name,
        role: adminUser.role,
        createdAt: adminUser.createdAt
      },
      passwordTest: {
        input: testPassword,
        isValid: isPasswordValid
      },
      environment: {
        NEXTAUTH_URL: process.env.NEXTAUTH_URL,
        DATABASE_URL: process.env.DATABASE_URL ? 'Set' : 'Not set'
      }
    })

  } catch (error) {
    console.error('Test login error:', error)
    return NextResponse.json(
      {
        status: 'error',
        message: 'Database error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}