"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  LayoutDashboard,
  MessageSquare,
  BookOpen,
  ImageIcon,
  Calendar,
  Users,
  LogOut,
  Home,
  Menu,
  X
} from "lucide-react"
import { useState } from "react"

interface AdminSidebarProps {
  user: {
    id: string
    email?: string | null
    name?: string | null
  }
}

export default function AdminSidebar({ user }: AdminSidebarProps) {
  const pathname = usePathname() ?? '/'
  const [isOpen, setIsOpen] = useState(false)

  const handleSignOut = async () => {
    try {
      await fetch("/api/admin-logout", {
        method: "POST",
      })
    } catch (error) {
      console.error("Logout error:", error)
    }
    // Redirect to public user page
    window.location.href = "/";
  }

  const navItems = [
    { href: "/admin", label: "Dasbor", icon: LayoutDashboard, exact: true },
    { href: "/admin/curhat", label: "Manajemen Curhat", icon: MessageSquare },
    { href: "/admin/ebooks", label: "E-Book", icon: BookOpen },
    { href: "/admin/gallery", label: "Galeri", icon: ImageIcon },
    { href: "/admin/events", label: "Event", icon: Calendar },
    { href: "/admin/members", label: "Anggota", icon: Users },
  ]

  return (
    <>
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsOpen(!isOpen)}
          className="bg-card"
        >
          {isOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
        </Button>
      </div>

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-40 w-64 bg-card border-r border-border transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static lg:inset-0
      `}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-center h-16 px-4 border-b border-border">
            <Link href="/admin" className="text-xl font-bold text-card-foreground">
              Panel Admin
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {navItems.map((item) => {
              const isActive = item.exact ? pathname === item.href : pathname.startsWith(item.href)
              const Icon = item.icon

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-card-foreground hover:bg-muted hover:text-card-foreground"
                  }`}
                >
                  <Icon className="w-5 h-5 mr-3" />
                  {item.label}
                </Link>
              )
            })}
          </nav>

          <div className="border-t border-border" />

          {/* User Actions */}
          <div className="p-4 space-y-2">
            <div className="text-xs text-muted-foreground px-3 py-2">
              {user.email}
            </div>

            <Link href="/" onClick={() => setIsOpen(false)}>
              <Button variant="ghost" size="sm" className="w-full justify-start">
                <Home className="w-4 h-4 mr-3" />
                Kembali ke Situs
              </Button>
            </Link>

            <Button
              variant="ghost"
              size="sm"
              onClick={handleSignOut}
              className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <LogOut className="w-4 h-4 mr-3" />
              Keluar
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  )
}

