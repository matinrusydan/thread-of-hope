import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  const startTime = Date.now()

  try {
    // Test database connection
    await prisma.$connect()

    // Get database stats
    const userCount = await prisma.user.count()
    const curhatCount = await prisma.curhat.count()
    const ebookCount = await prisma.ebook.count()

    // Test Prisma client generation
    const prismaVersion = (prisma as any)._clientVersion || 'Unknown'

    const healthCheck = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      responseTime: Date.now() - startTime,

      database: {
        connection: '✅ Connected',
        userCount,
        curhatCount,
        ebookCount,
        prismaVersion
      },

      environment: {
        NODE_ENV: process.env.NODE_ENV,
        NEXTAUTH_URL: process.env.NEXTAUTH_URL,
        DATABASE_URL: process.env.DATABASE_URL ? '✅ Set' : '❌ Missing',
        NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET ? '✅ Set' : '❌ Missing'
      },

      system: {
        platform: process.platform,
        arch: process.arch,
        nodeVersion: process.version,
        memory: {
          used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
          total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024),
          rss: Math.round(process.memoryUsage().rss / 1024 / 1024)
        }
      }
    }

    return NextResponse.json(healthCheck)

  } catch (error) {
    console.error('Health check failed:', error)

    const errorResponse = {
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      responseTime: Date.now() - startTime,
      error: error instanceof Error ? error.message : 'Unknown error',

      database: {
        connection: '❌ Failed',
        error: error instanceof Error ? error.message : 'Unknown database error'
      },

      environment: {
        NODE_ENV: process.env.NODE_ENV,
        DATABASE_URL: process.env.DATABASE_URL ? '✅ Set' : '❌ Missing',
        NEXTAUTH_URL: process.env.NEXTAUTH_URL || 'Not set'
      }
    }

    return NextResponse.json(errorResponse, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}