import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const authConfig = {
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET ? '✅ Set' : '❌ Missing',
    NEXTAUTH_URL: process.env.NEXTAUTH_URL || '❌ Not set',
    DATABASE_URL: process.env.DATABASE_URL ? '✅ Set' : '❌ Missing',
    NODE_ENV: process.env.NODE_ENV,
    currentDomain: request.headers.get('host'),
    expectedDomain: process.env.NEXTAUTH_URL?.replace('https://', ''),
  }

  const issues = []

  if (!process.env.NEXTAUTH_SECRET) {
    issues.push('NEXTAUTH_SECRET is missing')
  }

  if (!process.env.NEXTAUTH_URL) {
    issues.push('NEXTAUTH_URL is not set')
  } else if (!process.env.NEXTAUTH_URL.includes(request.headers.get('host') || '')) {
    issues.push(`NEXTAUTH_URL (${process.env.NEXTAUTH_URL}) doesn't match current domain (${request.headers.get('host')})`)
  }

  if (!process.env.DATABASE_URL) {
    issues.push('DATABASE_URL is missing')
  }

  return NextResponse.json({
    status: issues.length === 0 ? 'success' : 'warning',
    message: issues.length === 0 ? 'All NextAuth configurations are correct' : 'Found configuration issues',
    config: authConfig,
    issues: issues,
    recommendations: issues.length > 0 ? [
      'Check Vercel environment variables',
      'Ensure NEXTAUTH_URL matches your domain',
      'Verify NEXTAUTH_SECRET is set',
      'Redeploy after fixing environment variables'
    ] : []
  })
}