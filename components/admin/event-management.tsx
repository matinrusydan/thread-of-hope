"use client"

import { useState } from "react"
import { formatDistanceToNow, format } from "date-fns"
import { id } from "date-fns/locale"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Eye, Edit, Trash2, Plus, Star, MapPin, Calendar } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

interface Event {
  id: string
  title: string
  description: string | null
  eventDate: string | null
  location: string | null
  imagePath: string | null
  isFeatured: boolean
  createdAt: string
}

interface EventManagementProps {
  initialEvents: Event[]
}

export default function EventManagement({ initialEvents }: EventManagementProps) {
  const [events, setEvents] = useState<Event[]>(initialEvents)
  const [loading, setLoading] = useState<string | null>(null)

  const handleToggleFeatured = async (eventId: string, currentStatus: boolean) => {
    setLoading(eventId)
    try {
      const response = await fetch(`/api/events/${eventId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isFeatured: !currentStatus }),
      })

      if (response.ok) {
        setEvents(events.map((event) => (event.id === eventId ? { ...event, isFeatured: !currentStatus } : event)))
      }
    } catch (error) {
      console.error("Error toggling featured status:", error)
    } finally {
      setLoading(null)
    }
  }

  const handleDelete = async (eventId: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus event ini?")) return

    setLoading(eventId)
    try {
      const response = await fetch(`/api/events/${eventId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setEvents(events.filter((event) => event.id !== eventId))
      }
    } catch (error) {
      console.error("Error deleting event:", error)
    } finally {
      setLoading(null)
    }
  }

  const featuredEvents = events.filter((event) => event.isFeatured)
  const upcomingEvents = events.filter((event) => event.eventDate && new Date(event.eventDate) > new Date())
  const pastEvents = events.filter((event) => event.eventDate && new Date(event.eventDate) <= new Date())

  const EventCard = ({ event }: { event: Event }) => (
    <Card key={event.id} className="mb-4">
      <CardContent className="p-6">
        <div className="flex gap-4">
          <div className="w-24 h-24 flex-shrink-0">
            {event.imagePath ? (
              <Image
                src={event.imagePath || "/placeholder.svg"}
                alt={event.title}
                width={96}
                height={96}
                className="object-cover rounded"
              />
            ) : (
              <div className="w-full h-full bg-muted rounded flex items-center justify-center">
                <Calendar className="w-8 h-8 text-muted-foreground" />
              </div>
            )}
          </div>

          <div className="flex-1">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h3 className="text-lg font-semibold text-card-foreground">{event.title}</h3>
                <p className="text-sm text-muted-foreground">{event.description}</p>
                {event.eventDate && (
                  <div className="flex items-center text-sm text-muted-foreground mt-1">
                    <Calendar className="w-4 h-4 mr-1" />
                    {format(new Date(event.eventDate), "PPP", { locale: id })}
                  </div>
                )}
                {event.location && (
                  <div className="flex items-center text-sm text-muted-foreground mt-1">
                    <MapPin className="w-4 h-4 mr-1" />
                    {event.location}
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2">
                {event.isFeatured && <Badge variant="default">Unggulan</Badge>}
                {event.eventDate && new Date(event.eventDate) > new Date() && (
                  <Badge variant="secondary">Akan Datang</Badge>
                )}
                {event.eventDate && new Date(event.eventDate) <= new Date() && (
                  <Badge variant="outline">Selesai</Badge>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                Dibuat {formatDistanceToNow(new Date(event.createdAt), { addSuffix: true, locale: id })}
              </div>

              <div className="flex items-center gap-2">
                <Button size="sm" variant="outline">
                  <Eye className="w-4 h-4 mr-1" />
                  Lihat
                </Button>

                <Button
                  size="sm"
                  variant={event.isFeatured ? "default" : "outline"}
                  onClick={() => handleToggleFeatured(event.id, event.isFeatured)}
                  disabled={loading === event.id}
                >
                  <Star className="w-4 h-4 mr-1" />
                  {event.isFeatured ? "Hapus Unggulan" : "Jadikan Unggulan"}
                </Button>

                <Link href={`/admin/events/${event.id}`}>
                  <Button size="sm" variant="outline">
                    <Edit className="w-4 h-4 mr-1" />
                    Edit
                  </Button>
                </Link>

                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleDelete(event.id)}
                  disabled={loading === event.id}
                >
                  <Trash2 className="w-4 h-4 mr-1" />
                  Hapus
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Manajemen Event</h1>
          <p className="text-muted-foreground mt-2">Kelola event dan kegiatan komunitas</p>
        </div>
        <Link href="/admin/events/new">
          <Button className="bg-primary text-primary-foreground hover:bg-secondary">
            <Plus className="w-4 h-4 mr-2" />
            Tambah Event Baru
          </Button>
        </Link>
      </div>

      <Tabs defaultValue="all" className="space-y-6">
        <TabsList>
          <TabsTrigger value="all">Semua Event ({events.length})</TabsTrigger>
          <TabsTrigger value="upcoming">Akan Datang ({upcomingEvents.length})</TabsTrigger>
          <TabsTrigger value="featured">Unggulan ({featuredEvents.length})</TabsTrigger>
          <TabsTrigger value="past">Selesai ({pastEvents.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          {events.length > 0 ? (
            events.map((event) => <EventCard key={event.id} event={event} />)
          ) : (
            <Card>
              <CardContent className="text-center py-8">
                <p className="text-muted-foreground">Belum ada event</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="upcoming">
          {upcomingEvents.length > 0 ? (
            upcomingEvents.map((event) => <EventCard key={event.id} event={event} />)
          ) : (
            <Card>
              <CardContent className="text-center py-8">
                <p className="text-muted-foreground">Tidak ada event yang akan datang</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="featured">
          {featuredEvents.length > 0 ? (
            featuredEvents.map((event) => <EventCard key={event.id} event={event} />)
          ) : (
            <Card>
              <CardContent className="text-center py-8">
                <p className="text-muted-foreground">Tidak ada event unggulan</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="past">
          {pastEvents.length > 0 ? (
            pastEvents.map((event) => <EventCard key={event.id} event={event} />)
          ) : (
            <Card>
              <CardContent className="text-center py-8">
                <p className="text-muted-foreground">Tidak ada event yang sudah selesai</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}