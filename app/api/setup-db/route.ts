import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    const { secret } = await request.json()

    if (secret !== process.env.ADMIN_SEED_SECRET) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    console.log('🚀 Starting database setup...')

    // Check current database status
    const tables = [
      'User', 'Curhat', 'Ebook', 'CommunityMember',
      'Event', 'Gallery', 'AdminUser', 'Account', 'Session', 'VerificationToken'
    ]

    const tableStatus: Record<string, any> = {}
    for (const table of tables) {
      try {
        const count = await (prisma as any)[table.toLowerCase()].count()
        tableStatus[table] = { status: 'exists', count }
      } catch (error) {
        tableStatus[table] = { status: 'missing', error: error instanceof Error ? error.message : 'Unknown error' }
      }
    }

    // If User table doesn't exist, we need to create all tables
    const userTableExists = tableStatus['User'].status === 'exists'

    if (!userTableExists) {
      console.log('📦 Creating database tables...')

      // Create tables using raw SQL
      await prisma.$executeRaw`
        -- Create User table
        CREATE TABLE IF NOT EXISTS "User" (
            "id" TEXT NOT NULL,
            "name" TEXT,
            "email" TEXT NOT NULL,
            "emailVerified" TIMESTAMP(3),
            "image" TEXT,
            "password" TEXT,
            "role" TEXT NOT NULL DEFAULT 'user',
            "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
            "updatedAt" TIMESTAMP(3) NOT NULL,
            CONSTRAINT "User_pkey" PRIMARY KEY ("id")
        );

        -- Create Curhat table
        CREATE TABLE IF NOT EXISTS "Curhat" (
            "id" TEXT NOT NULL,
            "title" TEXT NOT NULL,
            "content" TEXT NOT NULL,
            "authorName" TEXT NOT NULL,
            "isApproved" BOOLEAN NOT NULL DEFAULT false,
            "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
            "updatedAt" TIMESTAMP(3) NOT NULL,
            "authorId" TEXT,
            CONSTRAINT "Curhat_pkey" PRIMARY KEY ("id")
        );

        -- Create indexes
        CREATE UNIQUE INDEX IF NOT EXISTS "User_email_key" ON "User"("email");
        CREATE INDEX IF NOT EXISTS "Curhat_authorId_idx" ON "Curhat"("authorId");

        -- Create foreign keys
        ALTER TABLE "Curhat" ADD CONSTRAINT IF NOT EXISTS "Curhat_authorId_fkey"
        FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
      `

      console.log('✅ Basic tables created successfully!')
    }

    // Create admin user if not exists
    console.log('👤 Setting up admin user...')
    const adminExists = await prisma.user.findUnique({
      where: { email: 'admin@threadofhope.com' }
    })

    if (!adminExists) {
      const bcrypt = await import('bcryptjs')
      const hashedPassword = await bcrypt.hash('rikariyani9173', 10)

      await prisma.user.create({
        data: {
          id: 'admin-001',
          email: 'admin@threadofhope.com',
          password: hashedPassword,
          name: 'Admin User',
          role: 'admin'
        }
      })

      console.log('✅ Admin user created!')
    } else {
      console.log('ℹ️ Admin user already exists')
    }

    // Final check
    const finalUserCount = await prisma.user.count()
    const finalCurhatCount = await prisma.curhat.count()

    return NextResponse.json({
      success: true,
      message: 'Database setup completed successfully!',
      initialStatus: tableStatus,
      finalStatus: {
        userCount: finalUserCount,
        curhatCount: finalCurhatCount
      },
      adminCredentials: {
        email: 'admin@threadofhope.com',
        password: 'rikariyani9173'
      }
    })

  } catch (error) {
    console.error('❌ Database setup failed:', error)
    return NextResponse.json(
      {
        error: 'Database setup failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'POST to this endpoint with { "secret": "your-secret-key" } to setup database'
  })
}