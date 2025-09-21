import multer from 'multer'
import path from 'path'
import fs from 'fs'
import { Request, Response } from 'express'

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(process.cwd(), 'public', 'uploads')
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true })
}

// Configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir)
  },
  filename: (req, file, cb) => {
    // Generate unique filename with timestamp
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    const extension = path.extname(file.originalname)
    const filename = file.fieldname + '-' + uniqueSuffix + extension
    cb(null, filename)
  }
})

// File filter for images
const imageFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true)
  } else {
    cb(new Error('Only image files are allowed!'))
  }
}

// File filter for ebooks (PDF)
const ebookFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  if (file.mimetype === 'application/pdf') {
    cb(null, true)
  } else {
    cb(new Error('Only PDF files are allowed!'))
  }
}

// Create multer instances
export const uploadImage = multer({
  storage,
  fileFilter: imageFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit for images
  }
})

export const uploadEbook = multer({
  storage,
  fileFilter: ebookFilter,
  limits: {
    fileSize: 50 * 1024 * 1024 // 50MB limit for ebooks
  }
})

// Utility function to get file URL
export const getFileUrl = (filename: string) => {
  return `/uploads/${filename}`
}

// Utility function to delete file
export const deleteFile = (filename: string) => {
  const filePath = path.join(uploadsDir, filename)
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath)
  }
}