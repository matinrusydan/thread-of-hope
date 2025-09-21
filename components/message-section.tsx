"use client"

import { useEffect, useState } from "react"
import Image from "next/image"

interface CurhatMessage {
  id: string
  title: string
  content: string
  authorName: string
  createdAt: string
}

export default function MessageSection() {
  const [messages, setMessages] = useState<CurhatMessage[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await fetch("/api/curhat?approved=true&limit=3")
        if (response.ok) {
          const data = await response.json()
          setMessages(data.data || [])
        } else {
          console.error("Error fetching messages")
        }
      } catch (error) {
        console.error("Error fetching messages:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchMessages()
  }, [])

  if (loading) {
    return (
      <section className="bg-card py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-pulse">Loading messages...</div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="bg-card py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-card-foreground mb-4">Pesan</h2>
          <p className="text-lg text-muted-foreground">
            Bercerita bukan berarti kamu lemah, tapi tanda kamu belum menyerah
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {messages.length > 0 ? (
            messages.map((message) => (
              <div
                key={message.id}
                className="bg-background p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="flex items-center mb-4">
                  <Image
                    src="/images/icon-profile.png"
                    alt="Profile"
                    width={40}
                    height={40}
                    className="rounded-full"
                  />
                  <div className="ml-3">
                    <span className="font-semibold text-foreground">{message.authorName}</span>
                  </div>
                </div>
                <h3 className="font-bold text-foreground mb-2">{message.title}</h3>
                <p className="text-muted-foreground leading-relaxed line-clamp-4">{message.content}</p>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center">
              <p className="text-muted-foreground">Belum ada cerita yang disetujui untuk ditampilkan.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
