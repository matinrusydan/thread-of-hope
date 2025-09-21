#!/usr/bin/env node
/*
  create_test_user.mjs
  Safe helper script to create a test user in Supabase using the service_role key.
  Usage (PowerShell):
    node .\\scripts\\create_test_user.mjs test@example.com P4ssw0rd!

  IMPORTANT: This script uses your SUPABASE_SERVICE_ROLE_KEY. Do NOT commit that key to a public repo.
*/
import fetch from "node-fetch"

const [,, email, password] = process.argv

if (!email || !password) {
  console.error("Usage: node scripts/create_test_user.mjs <email> <password>")
  process.exit(1)
}

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!SUPABASE_URL || !SERVICE_ROLE) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in environment.")
  process.exit(1)
}

async function createUser(email, password) {
  const url = `${SUPABASE_URL}/auth/v1/admin/users`

  const body = {
    email,
    password,
    email_confirm: true
  }

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "apikey": SERVICE_ROLE,
      "Authorization": `Bearer ${SERVICE_ROLE}`,
    },
    body: JSON.stringify(body),
  })

  const text = await res.text()
  try {
    const json = JSON.parse(text)
    if (!res.ok) {
      console.error("Supabase API error:", json)
      process.exit(1)
    }
    console.log("User created:", json)
  } catch (e) {
    console.error("Unexpected response:", text)
    process.exit(1)
  }
}

createUser(email, password).catch((err) => {
  console.error(err)
  process.exit(1)
})
