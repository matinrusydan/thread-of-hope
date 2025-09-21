#!/usr/bin/env node
/*
  setup_production_db.mjs
  Alternative script to set up production database using db push
  Usage: node scripts/setup_production_db.mjs
*/

import { execSync } from 'child_process'

const PRODUCTION_DATABASE_URL = "postgresql://neondb_owner:npg_Av14MKmHGLUE@ep-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"

async function setupProductionDB() {
  try {
    console.log('🚀 Setting up production database...')
    console.log('📍 Target database:', PRODUCTION_DATABASE_URL.replace(/:([^:@]{4})[^:@]*@/, ':$1****@'))

    // Set environment variable for production database
    const env = {
      ...process.env,
      DATABASE_URL: PRODUCTION_DATABASE_URL
    }

    console.log('📦 Step 1: Pushing schema to database...')

    // Use db push instead of migrate deploy (works better for production)
    const pushOutput = execSync('npx prisma db push --force-reset', {
      encoding: 'utf8',
      env: env,
      stdio: 'inherit'
    })

    console.log('✅ Database schema pushed successfully!')

    // Generate Prisma client
    console.log('🔧 Step 2: Generating Prisma client...')
    execSync('npx prisma generate', {
      encoding: 'utf8',
      env: env,
      stdio: 'inherit'
    })

    console.log('✅ Prisma client generated successfully!')
    console.log('🎉 Production database is ready!')

  } catch (error) {
    console.error('❌ Setup failed:', error.message)
    console.error('💡 Possible solutions:')
    console.error('   1. Check if Neon database is paused - resume it in Neon console')
    console.error('   2. Verify DATABASE_URL is correct')
    console.error('   3. Check network connectivity')
    console.error('   4. Try again in a few minutes')
    process.exit(1)
  }
}

setupProductionDB()