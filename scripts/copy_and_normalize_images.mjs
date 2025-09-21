#!/usr/bin/env node
import fs from 'fs'
import path from 'path'

const cwd = process.cwd()
const srcDir = path.join(cwd, 'thread of hope', 'images')
const destDir = path.join(cwd, 'public', 'images')

if (!fs.existsSync(srcDir)) {
  console.error('Source images folder not found:', srcDir)
  process.exit(1)
}

if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true })
}

function normalizeName(name) {
  // preserve extension
  const ext = path.extname(name)
  const base = path.basename(name, ext)
  // Replace whitespace and multiple spaces with single dash, remove unsafe chars
  const normalized = base
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^a-zA-Z0-9\-_.]/g, '')
    .replace(/-+/g, '-')
    .toLowerCase()
  return `${normalized}${ext}`
}

const files = fs.readdirSync(srcDir)
let copied = 0
for (const f of files) {
  const src = path.join(srcDir, f)
  if (!fs.statSync(src).isFile()) continue
  const normalized = normalizeName(f)
  const dst = path.join(destDir, normalized)
  fs.copyFileSync(src, dst)
  console.log(`Copied ${f} -> public/images/${normalized}`)
  copied++
}

console.log(`Done. ${copied} files copied to public/images with normalized names.`)
