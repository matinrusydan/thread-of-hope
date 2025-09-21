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
  "Kegiatan",
  "Komunitas",
  "Pendidikan",
  "Kesehatan Mental",
  "Lainnya"
]

interface GalleryItem {
  id: string
  title: string
  description: string | null
  imagePath: string
  category: string
  isFeatured: boolean
}

interface GalleryEditFormProps {
  galleryId: string
}

export default function GalleryEditForm({ galleryId }: GalleryEditFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [fetchLoading, setFetchLoading] = useState(true)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    imagePath: "",
    category: "",
    isFeatured: false
  })

  // Fetch existing gallery item
  useEffect(() => {
    const fetchGalleryItem = async () => {
      try {
        const response = await fetch(apiUrl(`/api/gallery/${galleryId}`))
        if (response.ok) {
          const data = await response.json()
          setFormData({
            title: data.title,
            description: data.description || "",
            imagePath: data.imagePath,
            category: data.category,
            isFeatured: data.isFeatured
          })
        }
      } catch (error) {
        console.error("Error fetching gallery item:", error)
        alert("Gagal memuat data galeri")
      } finally {
        setFetchLoading(false)
      }
    }

    fetchGalleryItem()
  }, [galleryId])

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploadingImage(true)
    try {
      const formDataUpload = new FormData()
      formDataUpload.append('image', file)

      const response = await fetch(apiUrl('/api/upload/image'), {
        method: 'POST',
        body: formDataUpload,
      })

      if (response.ok) {
        const data = await response.json()
        setFormData(prev => ({ ...prev, imagePath: data.fileUrl }))
      } else {
        alert('Upload gambar gagal')
      }
    } catch (error) {
      console.error('Upload error:', error)
      alert('Upload gambar gagal')
    } finally {
      setUploadingImage(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.title) {
      alert("Judul harus diisi")
      return
    }

    setLoading(true)

    try {
      const submitData = {
        id: galleryId,
        title: formData.title,
        description: formData.description,
        imagePath: formData.imagePath,
        category: formData.category,
        isFeatured: formData.isFeatured
      }

      const response = await fetch(apiUrl("/api/gallery"), {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submitData)
      })

      if (response.ok) {
        router.push("/admin/gallery")
      } else {
        const error = await response.json()
        alert(`Error: ${error.error}`)
      }
    } catch (error) {
      console.error("Error updating gallery item:", error)
      alert("Terjadi kesalahan saat mengupdate item galeri")
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
        <Link href="/admin/gallery">
          <Button variant="ghost" className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Kembali ke Manajemen Galeri
          </Button>
        </Link>
        <h1 className="text-3xl font-bold text-foreground">Edit Item Galeri</h1>
        <p className="text-muted-foreground mt-2">Edit informasi gambar galeri</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Informasi Item Galeri</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Judul *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                placeholder="Masukkan judul gambar"
                required
              />
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
              <Label htmlFor="description">Deskripsi</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                placeholder="Masukkan deskripsi gambar (opsional)"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="image">Gambar</Label>
              {formData.imagePath && (
                <div className="mb-4">
                  <Image
                    src={formData.imagePath}
                    alt="Current image"
                    width={200}
                    height={150}
                    className="object-cover rounded border"
                  />
                </div>
              )}
              <Input
                id="image"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={uploadingImage}
              />
              {uploadingImage && <p className="text-sm text-muted-foreground">Mengupload gambar...</p>}
              {formData.imagePath && <p className="text-sm text-green-600">✓ Gambar tersedia</p>}
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="isFeatured"
                checked={formData.isFeatured}
                onCheckedChange={(checked) => handleInputChange("isFeatured", checked as boolean)}
              />
              <Label htmlFor="isFeatured">Tandai sebagai unggulan</Label>
            </div>

            <div className="flex items-center justify-end space-x-4 pt-6">
              <Link href="/admin/gallery">
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