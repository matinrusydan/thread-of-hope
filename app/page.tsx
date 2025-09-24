import Navbar from "@/components/navbar"
import HeroSection from "@/components/hero-section"
import FeaturesSection from "@/components/features-section"
import StoryForm from "@/components/story-form"
import CurhatList from "@/components/curhat-list"
import Footer from "@/components/footer"
import { prisma } from "@/lib/prisma"

export const dynamic = 'force-dynamic'

export default async function HomePage() {
  let stories: any[] = []

  try {
    // Fetch from API to ensure consistent data structure
    const response = await fetch('/api/curhat?approved=true&limit=10', {
      cache: 'no-store'
    })

    if (response.ok) {
      const data = await response.json()
      stories = data.data || []
    } else {
      console.error("Failed to fetch curhat stories from API")
    }
  } catch (error) {
    console.error("Error fetching curhat stories:", error)
  }

  return (
    <main className="min-h-screen">
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <StoryForm />
      <CurhatList initialStories={stories} initialLimit={3} />
      <Footer />
    </main>
  )
}
