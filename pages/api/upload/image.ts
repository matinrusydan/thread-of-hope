import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '@/lib/prisma'
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
    // Check custom admin session
    const cookiesHeader = req.headers.cookie || '';
    const match = cookiesHeader.match(/admin_session=([^;]+)/);
    const adminSession = match ? match[1] : null;
    if (!adminSession) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    const user = await prisma.user.findUnique({ where: { id: adminSession } });
    if (!user || user.role !== 'admin') {
      return res.status(401).json({ error: 'Unauthorized' });
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