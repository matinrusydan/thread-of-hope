import { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { uploadImage, getFileUrl } from '@/lib/upload'

export const config = {
  api: {
    bodyParser: false,
  },
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    // Check authentication
    const session = await getServerSession(req, res, authOptions as any)
    if (!session || (session as any).user?.role !== 'admin') {
      return res.status(401).json({ error: 'Unauthorized' })
    }

    // Handle file upload
    await new Promise<void>((resolve, reject) => {
      const multerUpload = uploadImage.single('image')
      multerUpload(req as any, res as any, (err: any) => {
        if (err) {
          reject(err)
        } else {
          resolve()
        }
      })
    })

    const files = (req as any).file
    if (!files) {
      return res.status(400).json({ error: 'No file uploaded' })
    }

    const fileUrl = getFileUrl(files.filename)

    res.status(200).json({
      success: true,
      fileUrl,
      filename: files.filename
    })
  } catch (error: any) {
    console.error('Upload error:', error)
    res.status(500).json({ error: error.message || 'Upload failed' })
  }
}