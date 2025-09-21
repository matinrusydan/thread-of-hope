#!/usr/bin/env node
/*
  create_admin.mjs
  Script to create an admin user in the database
  Usage: node scripts/create_admin.mjs
*/

import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function createAdmin() {
  try {
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

    console.log('✅ Admin user created successfully!')
    console.log('📧 Email: admin@threadofhope.com')
    console.log('🔑 Password: rikariyani9173')
    console.log('')
    console.log('You can now login at: /auth/login')

  } catch (error) {
    console.error('❌ Error creating admin user:', error.message)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

createAdmin()