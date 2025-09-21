import Navbar from "@/components/navbar"
import HeroSection from "@/components/hero-section"
import FeaturesSection from "@/components/features-section"
import StoryForm from "@/components/story-form"
import MessageSection from "@/components/message-section"
import Footer from "@/components/footer"

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <StoryForm />
      <MessageSection />
      <Footer />
    </main>
  )
}
