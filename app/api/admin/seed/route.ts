import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    // Simple authentication - you can add more security here
    const { secret } = await request.json()

    // Check for a secret key to prevent unauthorized access
    if (secret !== process.env.ADMIN_SEED_SECRET) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    console.log('Creating admin user...')

    const hashedPassword = await bcrypt.hash('rikariyani9173', 10)

    const user = await prisma.user.upsert({
      where: { email: 'admin@threadofhope.com' },
      update: { role: 'admin' },
      create: {
        email: 'admin@threadofhope.com',
        password: hashedPassword,
        name: 'Admin User',
        role: 'admin'
      }
    })

    // Also create the AdminUser record
    await prisma.adminUser.upsert({
      where: { id: user.id },
      update: {},
      create: { id: user.id }
    })

    console.log('✅ Admin user created successfully!')

    return NextResponse.json({
      success: true,
      message: 'Admin user created successfully',
      email: 'admin@threadofhope.com',
      password: 'rikariyani9173'
    })

  } catch (error) {
    console.error('❌ Error creating admin user:', error)
    return NextResponse.json(
      { error: 'Failed to create admin user', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'POST to this endpoint with { "secret": "your-secret-key" } to seed admin user'
  })
}