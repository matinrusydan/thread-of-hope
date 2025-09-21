"use client"

import { useState } from "react"
import { formatDistanceToNow } from "date-fns"
import { id } from "date-fns/locale"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Eye, Edit, Trash2, Plus, Star } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { apiUrl } from "@/lib/api"

interface GalleryItem {
  id: string
  title: string
  description: string | null
  imagePath: string
  category: string
  isFeatured: boolean
  createdAt: string
}

interface GalleryManagementProps {
  initialGalleryItems: GalleryItem[]
}

export default function GalleryManagement({ initialGalleryItems }: GalleryManagementProps) {
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>(initialGalleryItems)
  const [loading, setLoading] = useState<string | null>(null)

  const handleToggleFeatured = async (itemId: string, currentStatus: boolean) => {
    setLoading(itemId)
    try {
      const response = await fetch(apiUrl(`/api/gallery/${itemId}`), {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isFeatured: !currentStatus }),
      })

      if (response.ok) {
        setGalleryItems(galleryItems.map((item) => (item.id === itemId ? { ...item, isFeatured: !currentStatus } : item)))
      }
    } catch (error) {
      console.error("Error toggling featured status:", error)
    } finally {
      setLoading(null)
    }
  }

  const handleDelete = async (itemId: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus item galeri ini?")) return

    setLoading(itemId)
    try {
      const response = await fetch(apiUrl(`/api/gallery/${itemId}`), {
        method: "DELETE",
      })

      if (response.ok) {
        setGalleryItems(galleryItems.filter((item) => item.id !== itemId))
      }
    } catch (error) {
      console.error("Error deleting gallery item:", error)
    } finally {
      setLoading(null)
    }
  }

  const featuredItems = galleryItems.filter((item) => item.isFeatured)
  const regularItems = galleryItems.filter((item) => !item.isFeatured)

  const GalleryCard = ({ item }: { item: GalleryItem }) => (
    <Card key={item.id} className="mb-4">
      <CardContent className="p-6">
        <div className="flex gap-4">
          <div className="w-24 h-24 flex-shrink-0">
            <Image
              src={item.imagePath || "/placeholder.svg"}
              alt={item.title}
              width={96}
              height={96}
              className="object-cover rounded"
            />
          </div>

          <div className="flex-1">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h3 className="text-lg font-semibold text-card-foreground">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </div>
              <div className="flex items-center gap-2">
                {item.isFeatured && <Badge variant="default">Unggulan</Badge>}
                <Badge variant="outline">{item.category}</Badge>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                {formatDistanceToNow(new Date(item.createdAt), { addSuffix: true, locale: id })}
              </div>

              <div className="flex items-center gap-2">
                <Button size="sm" variant="outline" onClick={() => window.open(item.imagePath, "_blank")}>
                  <Eye className="w-4 h-4 mr-1" />
                  Lihat
                </Button>

                <Button
                  size="sm"
                  variant={item.isFeatured ? "default" : "outline"}
                  onClick={() => handleToggleFeatured(item.id, item.isFeatured)}
                  disabled={loading === item.id}
                >
                  <Star className="w-4 h-4 mr-1" />
                  {item.isFeatured ? "Hapus Unggulan" : "Jadikan Unggulan"}
                </Button>

                <Link href={`/admin/gallery/${item.id}`}>
                  <Button size="sm" variant="outline">
                    <Edit className="w-4 h-4 mr-1" />
                    Edit
                  </Button>
                </Link>

                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleDelete(item.id)}
                  disabled={loading === item.id}
                >
                  <Trash2 className="w-4 h-4 mr-1" />
                  Hapus
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Manajemen Galeri</h1>
          <p className="text-muted-foreground mt-2">Kelola item galeri dan gambar</p>
        </div>
        <Link href="/admin/gallery/new">
          <Button className="bg-primary text-primary-foreground hover:bg-secondary">
            <Plus className="w-4 h-4 mr-2" />
            Tambah Item Galeri
          </Button>
        </Link>
      </div>

      <Tabs defaultValue="all" className="space-y-6">
        <TabsList>
          <TabsTrigger value="all">Semua Item ({galleryItems.length})</TabsTrigger>
          <TabsTrigger value="featured">Unggulan ({featuredItems.length})</TabsTrigger>
          <TabsTrigger value="regular">Biasa ({regularItems.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          {galleryItems.length > 0 ? (
            galleryItems.map((item) => <GalleryCard key={item.id} item={item} />)
          ) : (
            <Card>
              <CardContent className="text-center py-8">
                <p className="text-muted-foreground">Belum ada item galeri</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="featured">
          {featuredItems.length > 0 ? (
            featuredItems.map((item) => <GalleryCard key={item.id} item={item} />)
          ) : (
            <Card>
              <CardContent className="text-center py-8">
                <p className="text-muted-foreground">Tidak ada item unggulan</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="regular">
          {regularItems.length > 0 ? (
            regularItems.map((item) => <GalleryCard key={item.id} item={item} />)
          ) : (
            <Card>
              <CardContent className="text-center py-8">
                <p className="text-muted-foreground">Tidak ada item biasa</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}