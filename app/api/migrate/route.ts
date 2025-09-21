import { NextRequest, NextResponse } from 'next/server'
import { execSync } from 'child_process'

export async function POST(request: NextRequest) {
  try {
    // Simple authentication
    const { secret } = await request.json()

    if (secret !== process.env.ADMIN_SEED_SECRET) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    console.log('Starting database migration...')

    // Run Prisma migration deploy
    const output = execSync('npx prisma migrate deploy', {
      encoding: 'utf8',
      env: { ...process.env, DATABASE_URL: process.env.DATABASE_URL }
    })

    console.log('Migration completed successfully')
    console.log('Output:', output)

    return NextResponse.json({
      success: true,
      message: 'Database migration completed successfully',
      output: output
    })

  } catch (error) {
    console.error('Migration error:', error)
    const execError = error as any
    return NextResponse.json(
      {
        error: 'Migration failed',
        details: error instanceof Error ? error.message : 'Unknown error',
        stdout: execError.stdout || '',
        stderr: execError.stderr || ''
      },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'POST to this endpoint with { "secret": "your-secret-key" } to run database migration'
  })
}