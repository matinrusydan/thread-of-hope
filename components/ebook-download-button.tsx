"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"

interface Ebook {
  id: string
  title: string
  file_url: string
  download_count: number
}

interface EbookDownloadButtonProps {
  ebook: Ebook
}

export default function EbookDownloadButton({ ebook }: EbookDownloadButtonProps) {
  const [isDownloading, setIsDownloading] = useState(false)

  const handleDownload = async () => {
    setIsDownloading(true)
    try {
      // Increment download count
      await fetch(`/api/ebooks/${ebook.id}/download`, {
        method: "POST",
      })

      // Open download link
      window.open(ebook.file_url, "_blank")
    } catch (error) {
      console.error("Error downloading ebook:", error)
    } finally {
      setIsDownloading(false)
    }
  }

  return (
    <Button
      onClick={handleDownload}
      disabled={isDownloading}
      className="w-full bg-primary text-primary-foreground hover:bg-secondary"
      size="lg"
    >
      <Download className="w-5 h-5 mr-2" />
      {isDownloading ? "Mengunduh..." : "Download E-Book"}
    </Button>
  )
}
