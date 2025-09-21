#!/usr/bin/env node
/*
  check_db_status.mjs
  Script to check database connection and status
  Usage: node scripts/check_db_status.mjs
*/

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function checkDBStatus() {
  try {
    console.log('🔍 Checking database connection...')
    console.log('📍 Database URL:', process.env.DATABASE_URL?.replace(/:([^:@]{4})[^:@]*@/, ':$1****@'))

    // Test connection
    await prisma.$connect()
    console.log('✅ Database connection: SUCCESS')

    // Check if tables exist
    console.log('📊 Checking tables...')

    const tables = [
      'User',
      'Curhat',
      'Ebook',
      'CommunityMember',
      'Event',
      'Gallery',
      'AdminUser'
    ]

    for (const table of tables) {
      try {
        const count = await prisma[table.toLowerCase()].count()
        console.log(`✅ Table '${table}': EXISTS (${count} records)`)
      } catch (error) {
        console.log(`❌ Table '${table}': MISSING or ERROR`)
      }
    }

    // Test basic query
    console.log('🧪 Testing basic query...')
    const result = await prisma.$queryRaw`SELECT 1 as test`
    console.log('✅ Basic query: SUCCESS')

  } catch (error) {
    console.error('❌ Database check failed:', error.message)
    console.error('💡 Possible issues:')
    console.error('   1. Database is paused - resume in Neon console')
    console.error('   2. Wrong DATABASE_URL')
    console.error('   3. Network connectivity issues')
    console.error('   4. Database credentials expired')
  } finally {
    await prisma.$disconnect()
  }
}

checkDBStatus()