"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

export default function StoryForm() {
  const [formData, setFormData] = useState({
    nama: "",
    usia: "",
    harapan: "",
    cerita: "",
    setuju: false,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch("/api/curhat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        alert("Cerita berhasil dikirim! Terima kasih telah berbagi.")
        setFormData({
          nama: "",
          usia: "",
          harapan: "",
          cerita: "",
          setuju: false,
        })
      } else {
        alert("Terjadi kesalahan. Silakan coba lagi.")
      }
    } catch (error) {
      console.error("Error submitting story:", error)
      alert("Terjadi kesalahan. Silakan coba lagi.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section id="form-cerita" className="bg-background py-16 lg:py-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">Bagikan Cerita Mu</h2>
          <p className="text-lg text-muted-foreground">
            Bercerita bukan berarti kamu lemah, tapi tanda kamu belum menyerah
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="nama">Nama</Label>
              <Input
                id="nama"
                type="text"
                placeholder="Nama"
                value={formData.nama}
                onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                required
                className="mt-2"
              />
            </div>
            <div>
              <Label htmlFor="usia">Usia</Label>
              <Input
                id="usia"
                type="number"
                placeholder="Usia"
                value={formData.usia}
                onChange={(e) => setFormData({ ...formData, usia: e.target.value })}
                required
                className="mt-2"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="harapan">Harapan</Label>
            <Input
              id="harapan"
              type="text"
              placeholder="Harapan"
              value={formData.harapan}
              onChange={(e) => setFormData({ ...formData, harapan: e.target.value })}
              required
              className="mt-2"
            />
          </div>

          <div>
            <Label htmlFor="cerita">Cerita</Label>
            <Textarea
              id="cerita"
              placeholder="Mari ceritakan..."
              value={formData.cerita}
              onChange={(e) => setFormData({ ...formData, cerita: e.target.value })}
              required
              className="mt-2 min-h-[150px]"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="setuju"
              checked={formData.setuju}
              onCheckedChange={(checked) => setFormData({ ...formData, setuju: checked as boolean })}
              required
            />
            <Label htmlFor="setuju" className="text-sm">
              Saya menyetujui cerita saya dapat diposting oleh admin di landing page
            </Label>
          </div>

          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-primary text-primary-foreground hover:bg-secondary px-8 py-3 text-lg font-semibold"
            >
              {isSubmitting ? "Mengirim..." : "Kirim"}
            </Button>
          </div>
        </form>
      </div>
    </section>
  )
}
