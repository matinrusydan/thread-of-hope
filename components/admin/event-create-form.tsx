"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowLeft, Upload, Save } from "lucide-react"
import Link from "next/link"

export default function EventCreateForm() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    eventDate: "",
    location: "",
    imagePath: "",
    isFeatured: false
  })

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

      const response = await fetch('/api/upload/image', {
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

    if (!formData.title || !formData.eventDate) {
      alert("Judul dan tanggal event harus diisi")
      return
    }

    setLoading(true)

    try {
      const submitData = {
        title: formData.title,
        description: formData.description,
        eventDate: formData.eventDate,
        location: formData.location,
        imagePath: formData.imagePath,
        isFeatured: formData.isFeatured
      }

      const response = await fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submitData)
      })

      if (response.ok) {
        router.push("/admin/events")
      } else {
        const error = await response.json()
        alert(`Error: ${error.error}`)
      }
    } catch (error) {
      console.error("Error creating event:", error)
      alert("Terjadi kesalahan saat membuat event")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <Link href="/admin/events">
          <Button variant="ghost" className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Kembali ke Manajemen Event
          </Button>
        </Link>
        <h1 className="text-3xl font-bold text-foreground">Buat Event Baru</h1>
        <p className="text-muted-foreground mt-2">Tambahkan event baru ke kalender kegiatan</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Informasi Event</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="title">Judul Event *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  placeholder="Masukkan judul event"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="eventDate">Tanggal & Waktu *</Label>
                <Input
                  id="eventDate"
                  type="datetime-local"
                  value={formData.eventDate}
                  onChange={(e) => handleInputChange("eventDate", e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Lokasi</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => handleInputChange("location", e.target.value)}
                placeholder="Masukkan lokasi event (opsional)"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Deskripsi</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                placeholder="Masukkan deskripsi event (opsional)"
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="image">Gambar Event (Opsional)</Label>
              <Input
                id="image"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={uploadingImage}
              />
              {uploadingImage && <p className="text-sm text-muted-foreground">Mengupload gambar...</p>}
              {formData.imagePath && <p className="text-sm text-green-600">✓ Gambar berhasil diupload</p>}
              <p className="text-xs text-muted-foreground">
                Opsional: Upload gambar untuk event ini (contoh: poster event)
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="isFeatured"
                checked={formData.isFeatured}
                onCheckedChange={(checked) => handleInputChange("isFeatured", checked as boolean)}
              />
              <Label htmlFor="isFeatured">Tandai sebagai event unggulan</Label>
            </div>

            <div className="flex items-center justify-end space-x-4 pt-6">
              <Link href="/admin/events">
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
                    Simpan Event
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