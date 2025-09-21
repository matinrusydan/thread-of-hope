"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowLeft, Upload, Save } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { apiUrl } from "@/lib/api"

const categories = [
  "Kesehatan Mental",
  "Pengembangan Diri",
  "Hubungan Sosial",
  "Keluarga",
  "Karir",
  "Pendidikan",
  "Lainnya"
]

interface Ebook {
  id: string
  title: string
  description: string
  author: string
  category: string
  coverImagePath: string | null
  externalUrl: string
  isPublished: boolean
  isFeatured: boolean
  viewCount: number
  createdAt: string
}

interface EbookEditFormProps {
  ebookId: string
}

export default function EbookEditForm({ ebookId }: EbookEditFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [fetchLoading, setFetchLoading] = useState(true)
  const [uploadingCover, setUploadingCover] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    author: "",
    category: "",
    coverImagePath: "",
    externalUrl: "",
    isPublished: false,
    isFeatured: false
  })

  // Fetch existing ebook
  useEffect(() => {
    const fetchEbook = async () => {
      try {
        const response = await fetch(apiUrl(`/api/ebooks/${ebookId}?admin=true`))
        if (response.ok) {
          const responseData = await response.json()
          const ebook = responseData.data
          setFormData({
            title: ebook.title,
            description: ebook.description,
            author: ebook.author,
            category: ebook.category,
            coverImagePath: ebook.coverImagePath || "",
            externalUrl: ebook.externalUrl,
            isPublished: ebook.isPublished,
            isFeatured: ebook.isFeatured
          })
        }
      } catch (error) {
        console.error("Error fetching ebook:", error)
        alert("Gagal memuat data e-book")
      } finally {
        setFetchLoading(false)
      }
    }

    fetchEbook()
  }, [ebookId])

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleCoverImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploadingCover(true)
    try {
      const formDataUpload = new FormData()
      formDataUpload.append('image', file)

      const response = await fetch(apiUrl('/api/upload/image'), {
        method: 'POST',
        body: formDataUpload,
      })

      if (response.ok) {
        const data = await response.json()
        setFormData(prev => ({ ...prev, coverImagePath: data.fileUrl }))
      } else {
        alert('Upload gambar gagal')
      }
    } catch (error) {
      console.error('Upload error:', error)
      alert('Upload gambar gagal')
    } finally {
      setUploadingCover(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.title || !formData.externalUrl) {
      alert("Judul dan URL e-book harus diisi")
      return
    }

    setLoading(true)

    try {
      const submitData = {
        id: ebookId,
        title: formData.title,
        description: formData.description,
        author: formData.author,
        category: formData.category,
        coverImagePath: formData.coverImagePath,
        externalUrl: formData.externalUrl,
        isPublished: formData.isPublished,
        isFeatured: formData.isFeatured
      }

      const response = await fetch(apiUrl(`/api/ebooks/${ebookId}`), {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          isPublished: formData.isPublished,
          isFeatured: formData.isFeatured,
          title: formData.title,
          description: formData.description,
          author: formData.author,
          category: formData.category,
          coverImagePath: formData.coverImagePath,
          externalUrl: formData.externalUrl
        })
      })

      if (response.ok) {
        router.push("/admin/ebooks")
      } else {
        const error = await response.json()
        alert(`Error: ${error.error}`)
      }
    } catch (error) {
      console.error("Error updating ebook:", error)
      alert("Terjadi kesalahan saat mengupdate e-book")
    } finally {
      setLoading(false)
    }
  }

  if (fetchLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">Memuat data...</div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <Link href="/admin/ebooks">
          <Button variant="ghost" className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Kembali ke Manajemen E-Book
          </Button>
        </Link>
        <h1 className="text-3xl font-bold text-foreground">Edit E-Book</h1>
        <p className="text-muted-foreground mt-2">Edit informasi e-book</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Informasi E-Book</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="title">Judul *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  placeholder="Masukkan judul e-book"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="author">Penulis *</Label>
                <Input
                  id="author"
                  value={formData.author}
                  onChange={(e) => handleInputChange("author", e.target.value)}
                  placeholder="Masukkan nama penulis"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Kategori *</Label>
              <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih kategori" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Deskripsi *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                placeholder="Masukkan deskripsi e-book"
                rows={4}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="coverImage">Gambar Sampul</Label>
                {formData.coverImagePath && (
                  <div className="mb-4">
                    <Image
                      src={formData.coverImagePath}
                      alt="Current cover"
                      width={150}
                      height={200}
                      className="object-cover rounded border"
                    />
                  </div>
                )}
                <Input
                  id="coverImage"
                  type="file"
                  accept="image/*"
                  onChange={handleCoverImageUpload}
                  disabled={uploadingCover}
                />
                {uploadingCover && <p className="text-sm text-muted-foreground">Mengupload gambar...</p>}
                {formData.coverImagePath && <p className="text-sm text-green-600">✓ Gambar tersedia</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="externalUrl">URL E-Book *</Label>
                <Input
                  id="externalUrl"
                  type="url"
                  value={formData.externalUrl}
                  onChange={(e) => handleInputChange("externalUrl", e.target.value)}
                  placeholder="https://example.com/ebook-link"
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Masukkan URL lengkap ke e-book (contoh: Google Drive, Dropbox, dll.)
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="isPublished"
                  checked={formData.isPublished}
                  onCheckedChange={(checked) => handleInputChange("isPublished", checked as boolean)}
                />
                <Label htmlFor="isPublished">Terbitkan e-book</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="isFeatured"
                  checked={formData.isFeatured}
                  onCheckedChange={(checked) => handleInputChange("isFeatured", checked as boolean)}
                />
                <Label htmlFor="isFeatured">Tandai sebagai unggulan</Label>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-4 pt-6">
              <Link href="/admin/ebooks">
                <Button type="button" variant="outline">
                  Batal
                </Button>
              </Link>
              <Button type="submit" disabled={loading}>
                {loading ? (
                  "Menyimpan..."
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Simpan Perubahan
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}