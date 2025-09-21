import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import Image from 'next/image'
import Link from 'next/link'

export default function TentangPage() {
  return (
    <main className="min-h-screen">
      <Navbar />

      <section className="about-section py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="about-card relative rounded-lg overflow-hidden">
            <Image
              src="/images/kegiatan-kemanusiaan-mental-health-2.jpg"
              alt="Tentang Kami"
              width={1200}
              height={500}
              className="w-full h-auto object-cover"
            />

            <div className="about-overlay absolute inset-0 bg-black/40 flex items-center">
              <div className="about-content max-w-3xl mx-auto text-center text-white p-8">
                <h2 className="about-title text-3xl md:text-4xl font-bold">Merajut Harapan Melalui Cerita Bersama</h2>
                <p className="about-subtitle mt-4">Sebuah ruang untuk berbagi pengalaman, saling menguatkan, dan menumbuhkan harapan lewat cerita yang kita rangkai bersama.</p>
                <Link href="#visi-misi" className="inline-block mt-6 bg-yellow-400 text-black px-6 py-3 rounded">Visi &amp; Misi Kami</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4">
          <p className="text-center text-lg max-w-3xl mx-auto">“Thread of Hope adalah ruang kreatif dan inklusif untuk remaja sebaya, agar bisa bercerita, mendengar, dan pulih bersama.”</p>
        </div>
      </section>

      <section id="visi-misi" className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h3 className="text-2xl font-bold text-center mb-8">Visi &amp; Misi Kami</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-white p-6 rounded shadow">
              <h4 className="font-semibold text-lg">Visi</h4>
              <p className="mt-2">Menciptakan ruang nyaman untuk merawat kesehatan mental melalui seni &amp; cerita.</p>
            </div>
            <div className="bg-white p-6 rounded shadow">
              <h4 className="font-semibold text-lg">Misi</h4>
              <ul className="mt-2 list-disc list-inside">
                <li>Menjadi wadah bagi remaja untuk saling mendengar.</li>
                <li>Menyelenggarakan kegiatan kreatif untuk mewarnai setiap jiwa.</li>
                <li>Menghadirkan edukasi kesehatan mental melalui seminar &amp; workshop.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* join form removed per request - kept page focused on About content */}

      <Footer />
    </main>
  )
}
