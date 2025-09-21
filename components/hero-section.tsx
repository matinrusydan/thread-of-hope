import Image from "next/image"
import Link from "next/link"

export default function HeroSection() {
  return (
    <section className="hero-section py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-16">
          <div className="hero-content max-w-2xl">
            <div className="hero-header">
              <div className="flex items-end gap-4">
                <h1 className="hero-title text-5xl md:text-6xl font-extrabold leading-tight m-0">
                  <span className="highlight text-primary">CERITA KAMU</span>
                </h1>
                <img src="/images/payung-geulis.png" alt="Payung Geulis" className="hero-icon w-24 md:w-40" />
              </div>
              <h2 className="hero-subtitle text-3xl md:text-4xl font-semibold mt-2">SUARA YANG BERARTI</h2>
            </div>

            <p className="hero-description text-lg mt-6 text-muted-foreground">
              Berbagi adalah langkah kecil menuju pemulihan. Sampaikan ceritamu, biarkan orang lain terinspirasi, dan
              mari bersama-sama membangun ruang yang sehat untuk mental kita.
            </p>

            <Link href="#form-cerita" className="inline-block mt-6 bg-yellow-400 hover:bg-yellow-500 text-black px-6 py-3 rounded-full font-medium">
              Tulis Cerita
            </Link>
          </div>

          <div className="hero-image w-full lg:w-1/2 flex justify-center lg:justify-end">
            <Image src="/images/foto-landing-page.png" alt="Foto Landing Page" width={700} height={450} className="w-full max-w-[700px] rounded-lg object-cover" priority />
          </div>
        </div>
      </div>
    </section>
  )
}
