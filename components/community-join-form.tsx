"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Mail, Phone, MapPin } from "lucide-react"

export default function CommunityJoinForm() {
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone: "",
    age: "",
    city: "",
    occupation: "",
    motivation: "",
    how_did_you_hear: "",
    agree_terms: false,
    agree_privacy: false,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch("/api/community/join", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        setSubmitted(true)
        setFormData({
          full_name: "",
          email: "",
          phone: "",
          age: "",
          city: "",
          occupation: "",
          motivation: "",
          how_did_you_hear: "",
          agree_terms: false,
          agree_privacy: false,
        })
      } else {
        alert("Terjadi kesalahan. Silakan coba lagi.")
      }
    } catch (error) {
      console.error("Error submitting form:", error)
      alert("Terjadi kesalahan. Silakan coba lagi.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <section className="bg-background py-16">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="text-center">
            <CardContent className="p-12">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl">✅</span>
              </div>
              <h2 className="text-2xl font-bold text-card-foreground mb-4">Terima Kasih!</h2>
              <p className="text-muted-foreground mb-6">
                Pendaftaran Anda telah berhasil dikirim. Tim kami akan meninjau aplikasi Anda dan menghubungi Anda dalam
                1-3 hari kerja.
              </p>
              <Button onClick={() => setSubmitted(false)} variant="outline">
                Daftar Lagi
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>
    )
  }

  return (
    <section className="bg-background py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">Bergabung Sekarang</h2>
          <p className="text-muted-foreground">
            Isi formulir di bawah ini untuk menjadi bagian dari komunitas Thread of Hope
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="w-5 h-5 mr-2" />
              Formulir Pendaftaran Komunitas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Personal Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="full_name">Nama Lengkap *</Label>
                  <Input
                    id="full_name"
                    type="text"
                    placeholder="Masukkan nama lengkap"
                    value={formData.full_name}
                    onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                    required
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="age">Usia *</Label>
                  <Input
                    id="age"
                    type="number"
                    placeholder="Masukkan usia"
                    value={formData.age}
                    onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                    required
                    className="mt-2"
                  />
                </div>
              </div>

              {/* Contact Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="email">Email *</Label>
                  <div className="relative mt-2">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="nama@email.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                      className="pl-10"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="phone">Nomor Telepon</Label>
                  <div className="relative mt-2">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="08xxxxxxxxxx"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="pl-10"
                    />
                  </div>
                </div>
              </div>

              {/* Location and Occupation */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="city">Kota *</Label>
                  <div className="relative mt-2">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      id="city"
                      type="text"
                      placeholder="Masukkan kota tempat tinggal"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      required
                      className="pl-10"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="occupation">Pekerjaan</Label>
                  <Input
                    id="occupation"
                    type="text"
                    placeholder="Masukkan pekerjaan/profesi"
                    value={formData.occupation}
                    onChange={(e) => setFormData({ ...formData, occupation: e.target.value })}
                    className="mt-2"
                  />
                </div>
              </div>

              {/* Motivation */}
              <div>
                <Label htmlFor="motivation">Motivasi Bergabung *</Label>
                <Textarea
                  id="motivation"
                  placeholder="Ceritakan mengapa Anda ingin bergabung dengan komunitas Thread of Hope..."
                  value={formData.motivation}
                  onChange={(e) => setFormData({ ...formData, motivation: e.target.value })}
                  required
                  className="mt-2 min-h-[100px]"
                />
              </div>

              {/* How did you hear */}
              <div>
                <Label htmlFor="how_did_you_hear">Bagaimana Anda mengetahui Thread of Hope? *</Label>
                <Select
                  value={formData.how_did_you_hear}
                  onValueChange={(value) => setFormData({ ...formData, how_did_you_hear: value })}
                  required
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Pilih salah satu" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="social_media">Media Sosial</SelectItem>
                    <SelectItem value="friend_referral">Referensi Teman</SelectItem>
                    <SelectItem value="google_search">Pencarian Google</SelectItem>
                    <SelectItem value="event">Event/Workshop</SelectItem>
                    <SelectItem value="article">Artikel/Blog</SelectItem>
                    <SelectItem value="other">Lainnya</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Agreements */}
              <div className="space-y-4">
                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="agree_terms"
                    checked={formData.agree_terms}
                    onCheckedChange={(checked) => setFormData({ ...formData, agree_terms: checked as boolean })}
                    required
                  />
                  <Label htmlFor="agree_terms" className="text-sm leading-relaxed">
                    Saya menyetujui{" "}
                    <a href="#" className="text-primary hover:underline">
                      syarat dan ketentuan
                    </a>{" "}
                    komunitas Thread of Hope *
                  </Label>
                </div>

                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="agree_privacy"
                    checked={formData.agree_privacy}
                    onCheckedChange={(checked) => setFormData({ ...formData, agree_privacy: checked as boolean })}
                    required
                  />
                  <Label htmlFor="agree_privacy" className="text-sm leading-relaxed">
                    Saya menyetujui{" "}
                    <a href="#" className="text-primary hover:underline">
                      kebijakan privasi
                    </a>{" "}
                    dan penggunaan data pribadi *
                  </Label>
                </div>
              </div>

              <div className="flex justify-end">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-primary text-primary-foreground hover:bg-secondary px-8 py-3 text-lg font-semibold"
                >
                  {isSubmitting ? "Mengirim..." : "Bergabung Sekarang"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
