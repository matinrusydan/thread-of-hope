export default function FeaturesSection() {
  const features = [
    {
      title: "Untuk Kamu yang Ingin Berbagi",
      description: "Tuliskan ceritamu dan ungkapkan perasaanmu dengan aman.",
    },
    {
      title: "Untuk Kamu yang Ingin Membaca",
      description: "Temukan kisah inspiratif dari orang lain untuk menambah semangat.",
    },
    {
      title: "Untuk Dukungan Komunitas",
      description: "Bersama-sama kita ciptakan ruang sehat penuh empati.",
    },
    {
      title: "Untuk Kegiatan & Momen",
      description: "Lihat dokumentasi kegiatan dan momen kebersamaan yang sudah kami lakukan.",
    },
  ]

  return (
    <section className="py-24 bg-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h3 className="text-lg font-medium text-foreground">Apa yang kami tawarkan?</h3>
        </div>

        <div className="bg-white rounded-[30px] p-10 md:p-12 flex flex-col md:flex-row gap-10 box-border">
          {/* Left description */}
          <div className="deskripsi-wrapper max-w-[320px]">
            <p className="text-lg leading-relaxed text-foreground">
              Platform ini hadir untuk menjadi ruang aman, tempat berbagi cerita, menemukan inspirasi dari pengalaman
              orang lain, serta membangun komunitas yang saling peduli melalui cerita dan momen kebersamaan.
            </p>
          </div>

          {/* Right features grid */}
          <div className="flex-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              {features.map((feature, index) => (
                <div key={index} className="p-6 flex flex-col gap-3">
                  <h4 className="text-[20px] font-semibold text-foreground leading-tight">{feature.title}</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
