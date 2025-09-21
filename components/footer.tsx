import Link from "next/link"
import Image from "next/image"

export default function Footer() {
  return (
    <footer className="bg-card border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Useful Links */}
          <div>
            <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">Useful Links</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-card-foreground hover:text-primary transition-colors">
                  Beranda
                </Link>
              </li>
              <li>
                <Link href="/tentang" className="text-card-foreground hover:text-primary transition-colors">
                  Tentang
                </Link>
              </li>
              <li>
                <Link href="/galeri" className="text-card-foreground hover:text-primary transition-colors">
                  Galeri
                </Link>
              </li>
              <li>
                <Link href="/kontak" className="text-card-foreground hover:text-primary transition-colors">
                  Kontak
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <ul className="space-y-2 mb-4">
              <li className="text-card-foreground">+62 123456798</li>
              <li className="text-card-foreground">email@gmail.com</li>
            </ul>
            <div className="flex space-x-3">
              <Link href="#" className="hover:opacity-75 transition-opacity">
                <Image src="/images/icon-whatsapp.png" alt="WhatsApp" width={24} height={24} />
              </Link>
              <Link href="#" className="hover:opacity-75 transition-opacity">
                <Image src="/images/icon-tele.png" alt="Telegram" width={24} height={24} />
              </Link>
            </div>
          </div>

          {/* Join Us */}
          <div className="text-right">
            <Link
              href="#"
              className="inline-block bg-primary text-primary-foreground px-6 py-2 rounded-full font-medium hover:bg-secondary transition-colors mb-4"
            >
              Gabung Bersama Kami
            </Link>
            <p className="text-muted-foreground text-sm">Tasikmalaya, West Java, Indonesia</p>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="border-t border-border mt-12 pt-8 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-muted-foreground text-sm">© 2025 — Copyright</p>
          <Link href="#" className="text-muted-foreground text-sm hover:text-primary transition-colors">
            Privacy
          </Link>
        </div>
      </div>
    </footer>
  )
}
