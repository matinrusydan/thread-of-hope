import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"
import { id } from "date-fns/locale"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Download, ArrowLeft, BookOpen, Calendar, User } from "lucide-react"
import EbookDownloadButton from "@/components/ebook-download-button"

interface EbookDetailPageProps {
  params: Promise<{ id: string }>
}

export default async function EbookDetailPage({ params }: EbookDetailPageProps) {
  const { id: ebookId } = await params

  // Fetch ebook from API
  let ebook = null
  try {
    const response = await fetch(`/api/ebooks/${ebookId}`, {
      cache: 'no-store'
    })
    if (response.ok) {
      const data = await response.json()
      ebook = data.data
    }
  } catch (error) {
    console.error("Error fetching ebook:", error)
  }

  if (!ebook) {
    notFound()
  }

  return (
    <main className="min-h-screen">
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <Link href="/ebook" className="inline-flex items-center text-primary hover:text-secondary mb-8">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Kembali ke E-Book
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* E-book Cover */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <CardContent className="p-6">
                <div className="relative aspect-[3/4] mb-6 overflow-hidden rounded-lg">
                  {ebook.coverImageUrl ? (
                    <Image
                      src={ebook.coverImageUrl || "/placeholder.svg"}
                      alt={ebook.title}
                      fill
                      className="object-cover"
                      priority
                    />
                  ) : (
                    <div className="w-full h-full bg-muted flex items-center justify-center">
                      <BookOpen className="w-20 h-20 text-muted-foreground" />
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  <Badge variant="secondary" className="w-full justify-center">
                    {ebook.category}
                  </Badge>

                  <EbookDownloadButton ebook={ebook} />

                  <div className="text-center text-sm text-muted-foreground">
                    <div className="flex items-center justify-center mb-2">
                      <Download className="w-4 h-4 mr-1" />
                      {ebook.downloadCount} unduhan
                    </div>
                    <div className="flex items-center justify-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      {formatDistanceToNow(new Date(ebook.createdAt), { addSuffix: true, locale: id })}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* E-book Details */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <h1 className="text-3xl font-bold text-card-foreground mb-4">{ebook.title}</h1>
                <div className="flex items-center text-muted-foreground">
                  <User className="w-4 h-4 mr-2" />
                  <span>oleh {ebook.author}</span>
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold text-card-foreground mb-3">Deskripsi</h2>
                  <div className="prose prose-gray max-w-none">
                    <p className="text-card-foreground leading-relaxed whitespace-pre-wrap">{ebook.description}</p>
                  </div>
                </div>

                <div className="border-t border-border pt-6">
                  <h2 className="text-xl font-semibold text-card-foreground mb-4">Tentang E-Book Ini</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-card-foreground">Kategori:</span>
                      <span className="ml-2 text-muted-foreground">{ebook.category}</span>
                    </div>
                    <div>
                      <span className="font-medium text-card-foreground">Penulis:</span>
                      <span className="ml-2 text-muted-foreground">{ebook.author}</span>
                    </div>
                    <div>
                      <span className="font-medium text-card-foreground">Total Unduhan:</span>
                      <span className="ml-2 text-muted-foreground">{ebook.downloadCount}</span>
                    </div>
                    <div>
                      <span className="font-medium text-card-foreground">Dipublikasi:</span>
                      <span className="ml-2 text-muted-foreground">
                        {formatDistanceToNow(new Date(ebook.createdAt), { addSuffix: true, locale: id })}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Related E-books Section */}
        <section className="mt-16">
          <h3 className="text-2xl font-bold text-foreground mb-8">E-Book Lainnya</h3>
          <div className="text-center py-8">
            <p className="text-muted-foreground">Fitur e-book terkait akan segera hadir...</p>
            <Link href="/ebook" className="inline-block mt-4">
              <Button className="bg-primary text-primary-foreground hover:bg-secondary">Lihat Semua E-Book</Button>
            </Link>
          </div>
        </section>
      </div>

      <Footer />
    </main>
  )
}
