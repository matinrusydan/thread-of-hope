import { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { uploadImage, uploadEbook, getFileUrl } from '@/lib/upload'
import { prisma } from '@/lib/prisma'
import nextConnect from 'next-connect'

const handler = nextConnect<NextApiRequest, NextApiResponse>()

// Disable body parsing for file uploads
export const config = {
  api: {
    bodyParser: false,
  },
}

// Middleware to check admin authentication
handler.use(async (req, res, next) => {
  const session = await getServerSession(req, res, authOptions)

  if (!session || session.user.role !== 'admin') {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  next()
})

// Handle image uploads
handler.post('/api/upload/image', uploadImage.single('image'), async (req: any, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' })
    }

    const fileUrl = getFileUrl(req.file.filename)

    res.status(200).json({
      success: true,
      fileUrl,
      filename: req.file.filename
    })
  } catch (error) {
    console.error('Upload error:', error)
    res.status(500).json({ error: 'Upload failed' })
  }
})

// Handle ebook file uploads
handler.post('/api/upload/ebook', uploadEbook.single('ebook'), async (req: any, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' })
    }

    const fileUrl = getFileUrl(req.file.filename)

    res.status(200).json({
      success: true,
      fileUrl,
      filename: req.file.filename
    })
  } catch (error) {
    console.error('Upload error:', error)
    res.status(500).json({ error: 'Upload failed' })
  }
})

export default handler