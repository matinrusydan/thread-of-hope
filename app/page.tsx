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
    const curhatStories = await prisma.curhat.findMany({
      where: { isApproved: true },
      orderBy: { createdAt: 'desc' },
      take: 10,
      include: {
        comments: {
          where: { isApproved: true },
          orderBy: { createdAt: 'asc' },
          select: {
            id: true,
            content: true,
            authorName: true,
            createdAt: true,
          },
        },
        _count: {
          select: { comments: true, likes: true }
        }
      },
    })

    stories = curhatStories.map(story => ({
      ...story,
      author_name: story.authorName,
      created_at: story.createdAt.toISOString(),
      likes: story._count.likes,
      _count: undefined
    }))
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
