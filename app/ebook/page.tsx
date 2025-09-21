import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import EbookGrid from "@/components/ebook-grid"
import { apiUrl } from "@/lib/api"

export default async function EbookPage() {
  // Fetch published ebooks from API
  let ebooks = []
  try {
    const response = await fetch(apiUrl('/api/ebooks?published=true&limit=50'), {
      cache: 'force-cache',
      next: { revalidate: 3600 } // Revalidate every hour
    })
    if (response.ok) {
      const data = await response.json()
      ebooks = data.data || []
    }
  } catch (error) {
    console.error("Error fetching ebooks:", error)
  }

  return (
    <main className="min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section className="bg-background py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-6">
            <span className="text-primary">E-Book</span> Kesehatan Mental
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Koleksi e-book gratis tentang kesehatan mental, self-care, dan pengembangan diri untuk mendukung perjalanan
            pemulihan Anda.
          </p>
        </div>
      </section>

      {/* E-books Grid */}
      <EbookGrid initialEbooks={ebooks} />

      <Footer />
    </main>
  )
}
