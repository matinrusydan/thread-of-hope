"use client"

import Link from "next/link"
import { useState } from "react"
import { Menu, X } from "lucide-react"
import AuthButton from "./auth-button"

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  const toggleMenu = () => {
    setIsOpen(!isOpen)
  }

  return (
    <nav className="bg-background border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold text-foreground">
            thread of hope
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="/"
              className="px-6 py-2 rounded-full text-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
            >
              Beranda
            </Link>
            <Link
              href="/tentang"
              className="px-6 py-2 rounded-full text-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
            >
              Tentang
            </Link>
            <Link
              href="/ebook"
              className="px-6 py-2 rounded-full text-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
            >
              E-Book
            </Link>
            <Link
              href="/komunitas"
              className="px-6 py-2 rounded-full text-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
            >
              Komunitas
            </Link>
            <Link
              href="/galeri"
              className="px-6 py-2 rounded-full text-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
            >
              Galeri
            </Link>
          </div>

          {/* Auth Button */}
          <div className="hidden md:block">
            <AuthButton />
          </div>

          {/* Mobile menu button */}
          <button onClick={toggleMenu} className="md:hidden p-2 rounded-md text-foreground hover:bg-muted">
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-card rounded-lg mt-2 shadow-lg">
              <Link
                href="/"
                className="block px-3 py-2 rounded-md text-base font-medium text-card-foreground hover:bg-primary hover:text-primary-foreground"
                onClick={() => setIsOpen(false)}
              >
                Beranda
              </Link>
              <Link
                href="/tentang"
                className="block px-3 py-2 rounded-md text-base font-medium text-card-foreground hover:bg-primary hover:text-primary-foreground"
                onClick={() => setIsOpen(false)}
              >
                Tentang
              </Link>
              <Link
                href="/ebook"
                className="block px-3 py-2 rounded-md text-base font-medium text-card-foreground hover:bg-primary hover:text-primary-foreground"
                onClick={() => setIsOpen(false)}
              >
                E-Book
              </Link>
              <Link
                href="/komunitas"
                className="block px-3 py-2 rounded-md text-base font-medium text-card-foreground hover:bg-primary hover:text-primary-foreground"
                onClick={() => setIsOpen(false)}
              >
                Komunitas
              </Link>
              <Link
                href="/galeri"
                className="block px-3 py-2 rounded-md text-base font-medium text-card-foreground hover:bg-primary hover:text-primary-foreground"
                onClick={() => setIsOpen(false)}
              >
                Galeri
              </Link>
              <div className="px-3 py-2">
                <AuthButton />
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
