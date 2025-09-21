import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import Image from 'next/image'
import dynamic from 'next/dynamic'
import { apiUrl } from '@/lib/api'
const Calendar = dynamic(() => import('@/components/calendar'), { ssr: false })

export default async function GaleriPage() {
  // Fetch gallery items from API
  let galleryItems: any[] = []
  let eventsList: any[] = []

  try {
    // Fetch gallery items
    const galleryResponse = await fetch(apiUrl('/api/gallery?limit=20'), {
      cache: 'force-cache',
      next: { revalidate: 300 } // Revalidate every 5 minutes
    })
    if (galleryResponse.ok) {
      const data = await galleryResponse.json()
      galleryItems = data.data || []
    }

    // Fetch events
    const eventsResponse = await fetch(apiUrl('/api/events?limit=100'), {
      cache: 'force-cache',
      next: { revalidate: 3600 } // Revalidate every hour
    })
    if (eventsResponse.ok) {
      const data = await eventsResponse.json()
      eventsList = data.data || []
    }
  } catch (error) {
    console.error('Error fetching data for gallery:', error)
  }

  const serialized = eventsList.map((e: any) => ({
    id: String(e.id),
    title: e.title ?? '',
    event_date: e.eventDate ? new Date(e.eventDate).toISOString() : new Date().toISOString(),
    location: e.location ?? '',
    description: e.description ?? '',
    imagePath: e.imagePath ?? null
  }))

  return (
    <main className="min-h-screen">
      <Navbar />

      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold">Galeri Kegiatan</h2>
            <p className="mt-2 text-muted-foreground">Momen kebersamaan yang telah kami lalui untuk merajut harapan.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {galleryItems.length > 0 ? (
              galleryItems.map((item: any) => (
                <div key={item.id} className="bg-white rounded shadow overflow-hidden">
                  <Image
                    src={item.imagePath || "/placeholder.svg"}
                    alt={item.title}
                    width={600}
                    height={400}
                    className="object-cover w-full h-48"
                  />
                  <div className="p-3">
                    <div className="font-semibold">{item.title}</div>
                    {item.description && (
                      <div className="text-sm text-gray-600 mt-1">{item.description}</div>
                    )}
                    <div className="text-xs text-gray-500 mt-2 capitalize">{item.category}</div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-8">
                <p className="text-gray-500">Belum ada foto galeri yang tersedia.</p>
              </div>
            )}
          </div>

          <div className="mt-16">
            <h3 className="text-3xl font-bold mb-8 text-center">Kalender Event</h3>
            <div className="bg-white p-8 rounded-lg shadow-lg">
              {eventsList.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground text-lg">Belum ada event yang dijadwalkan.</p>
                  <p className="text-sm text-muted-foreground mt-2">Event akan muncul di sini setelah ditambahkan oleh admin.</p>
                </div>
              ) : (
                <div>
                  {/* Large Calendar is client-side only */}
                  <div className="w-full">
                    <Calendar events={serialized} />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
