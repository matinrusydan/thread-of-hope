"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { LogOut, Home } from "lucide-react"

interface AdminNavbarProps {
  user: {
    id: string
    email?: string | null
    name?: string | null
  }
}

export default function AdminNavbar({ user }: AdminNavbarProps) {
  const pathname = usePathname()

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/" })
  }

  const navItems = [
    { href: "/admin", label: "Dasbor", exact: true },
    { href: "/admin/curhat", label: "Manajemen Curhat" },
    { href: "/admin/ebooks", label: "E-Book" },
    { href: "/admin/gallery", label: "Galeri" },
    { href: "/admin/events", label: "Event" },
    { href: "/admin/members", label: "Anggota" },
  ]

  return (
    <nav className="bg-card border-b border-border shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Navigation */}
          <div className="flex items-center space-x-8">
            <Link href="/admin" className="text-xl font-bold text-card-foreground">
              Panel Admin
            </Link>

            <div className="hidden md:flex items-center space-x-4">
              {navItems.map((item) => {
                const isActive = item.exact ? pathname === item.href : pathname.startsWith(item.href)

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "text-card-foreground hover:bg-muted hover:text-card-foreground"
                    }`}
                  >
                    {item.label}
                  </Link>
                )
              })}
            </div>
          </div>

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            <Link href="/">
              <Button variant="ghost" size="sm">
                <Home className="w-4 h-4 mr-2" />
                Kembali ke Situs
              </Button>
            </Link>

            <span className="text-sm text-muted-foreground">{user.email}</span>

            <Button variant="ghost" size="sm" onClick={handleSignOut}>
              <LogOut className="w-4 h-4 mr-2" />
              Keluar
            </Button>
          </div>
        </div>
      </div>
    </nav>
  )
}
