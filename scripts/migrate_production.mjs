#!/usr/bin/env node
/*
  migrate_production.mjs
  Script to run database migrations for production
  Usage: node scripts/migrate_production.mjs
*/

import { execSync } from 'child_process'

const PRODUCTION_DATABASE_URL = "postgresql://neondb_owner:npg_Av14MKmHGLUE@ep-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"

async function migrateProduction() {
  try {
    console.log('🚀 Starting production database migration...')
    console.log('📍 Target database:', PRODUCTION_DATABASE_URL.replace(/:([^:@]{4})[^:@]*@/, ':$1****@'))

    // Set environment variable for production database
    const env = {
      ...process.env,
      DATABASE_URL: PRODUCTION_DATABASE_URL
    }

    console.log('📦 Running: npx prisma migrate deploy')

    // Run migration
    const output = execSync('npx prisma migrate deploy', {
      encoding: 'utf8',
      env: env,
      stdio: 'inherit'
    })

    console.log('✅ Migration completed successfully!')
    console.log('📊 Output:', output)

    // Generate Prisma client
    console.log('🔧 Generating Prisma client...')
    execSync('npx prisma generate', {
      encoding: 'utf8',
      env: env,
      stdio: 'inherit'
    })

    console.log('✅ Prisma client generated successfully!')

  } catch (error) {
    console.error('❌ Migration failed:', error.message)
    console.error('📋 Error details:', error)
    process.exit(1)
  }
}

migrateProduction()