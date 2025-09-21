import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import CommunityJoinForm from "@/components/community-join-form"
import CommunityStats from "@/components/community-stats"

export default async function KomunitasPage() {
  // Fetch community stats from API
  let totalMembers = 0
  try {
    // TODO: Create API endpoint for community stats
    // const response = await fetch('/api/community/stats')
    // if (response.ok) {
    //   const data = await response.json()
    //   totalMembers = data.totalMembers || 0
    // }
  } catch (error) {
    console.error("Error fetching community stats:", error)
  }

  const stats = {
    totalMembers,
  }

  return (
    <main className="min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section className="bg-background py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Bergabung dengan <span className="text-primary">Komunitas</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Mari bersama-sama membangun komunitas yang saling mendukung dalam perjalanan kesehatan mental. Bergabunglah
            dengan ribuan orang yang telah merasakan manfaat dari berbagi dan saling peduli.
          </p>
        </div>
      </section>

      {/* Community Stats */}
      <CommunityStats stats={stats} />

      {/* Benefits Section */}
      <section className="bg-card py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-card-foreground mb-4">Mengapa Bergabung dengan Kami?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Dapatkan manfaat eksklusif dan dukungan penuh dari komunitas Thread of Hope
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl text-primary-foreground">💬</span>
              </div>
              <h3 className="text-xl font-semibold text-card-foreground mb-3">Dukungan Komunitas</h3>
              <p className="text-muted-foreground">
                Dapatkan dukungan emosional dari sesama anggota yang memahami perjalanan Anda
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl text-primary-foreground">📚</span>
              </div>
              <h3 className="text-xl font-semibold text-card-foreground mb-3">Akses E-Book Eksklusif</h3>
              <p className="text-muted-foreground">
                Dapatkan akses prioritas ke e-book dan materi edukasi kesehatan mental terbaru
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl text-primary-foreground">🎯</span>
              </div>
              <h3 className="text-xl font-semibold text-card-foreground mb-3">Program Khusus</h3>
              <p className="text-muted-foreground">
                Ikuti workshop, webinar, dan kegiatan komunitas yang dirancang khusus untuk anggota
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl text-primary-foreground">🤝</span>
              </div>
              <h3 className="text-xl font-semibold text-card-foreground mb-3">Mentoring</h3>
              <p className="text-muted-foreground">
                Kesempatan untuk mendapatkan bimbingan dari mentor berpengalaman di bidang kesehatan mental
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl text-primary-foreground">📅</span>
              </div>
              <h3 className="text-xl font-semibold text-card-foreground mb-3">Event Prioritas</h3>
              <p className="text-muted-foreground">
                Dapatkan informasi dan akses prioritas untuk event-event komunitas dan kegiatan offline
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl text-primary-foreground">🌟</span>
              </div>
              <h3 className="text-xl font-semibold text-card-foreground mb-3">Ruang Aman</h3>
              <p className="text-muted-foreground">
                Lingkungan yang aman, bebas judgment, dan penuh empati untuk berbagi pengalaman
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Join Form */}
      <CommunityJoinForm />

      <Footer />
    </main>
  )
}
