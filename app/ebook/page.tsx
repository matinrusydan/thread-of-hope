import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import EbookGrid from "@/components/ebook-grid"
import { prisma } from "@/lib/prisma"

// Disable static generation for this page (needs database)
export const dynamic = 'force-dynamic'

export default async function EbookPage() {
  // Fetch published ebooks from database
  let ebooks: any[] = []
  try {
    const dbEbooks = await prisma.ebook.findMany({
      where: { isPublished: true },
      take: 50,
      orderBy: { createdAt: "desc" },
    })
    ebooks = dbEbooks.map(ebook => ({
      ...ebook,
      createdAt: ebook.createdAt.toISOString(),
    }))
  } catch (error) {
    console.error("Error fetching ebooks:", error)
    // Continue with empty array
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
