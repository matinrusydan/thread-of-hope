import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    // Test database connection
    await prisma.$connect()

    // Test simple query
    const userCount = await prisma.user.count()

    return NextResponse.json({
      status: 'success',
      database: 'connected',
      userCount,
      timestamp: new Date().toISOString(),
      env: {
        DATABASE_URL: process.env.DATABASE_URL ? '✅ Set' : '❌ Missing',
        NODE_ENV: process.env.NODE_ENV,
      }
    })
  } catch (error) {
    console.error('Database connection error:', error)
    return NextResponse.json({
      status: 'error',
      message: 'Database connection failed',
      error: error instanceof Error ? error.message : 'Unknown error',
      env: {
        DATABASE_URL: process.env.DATABASE_URL ? '✅ Set' : '❌ Missing',
        NODE_ENV: process.env.NODE_ENV,
      }
    }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}