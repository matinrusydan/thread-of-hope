#!/usr/bin/env node
/*
  migrate_images.mjs
  Copies all files from the folder "thread of hope/images" into "public/images".
  Usage (PowerShell):
    node .\\scripts\\migrate_images.mjs

  This is a local convenience script for development.
*/
import fs from "fs"
import path from "path"

const cwd = process.cwd()
const fromDir = path.join(cwd, "thread of hope", "images")
const toDir = path.join(cwd, "public", "images")

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
}

function copyFiles() {
  if (!fs.existsSync(fromDir)) {
    console.error(`Source folder not found: ${fromDir}`)
    process.exit(1)
  }

  ensureDir(toDir)

  const files = fs.readdirSync(fromDir)
  let copied = 0
  for (const f of files) {
    const src = path.join(fromDir, f)
    const dst = path.join(toDir, f)
    const stat = fs.statSync(src)
    if (stat.isFile()) {
      fs.copyFileSync(src, dst)
      console.log(`Copied ${f} -> public/images/${f}`)
      copied++
    }
  }

  console.log(`Done. ${copied} files copied.`)
}

copyFiles()
