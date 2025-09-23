import { redirect } from "next/navigation"
import AdminSidebar from "@/components/admin/admin-navbar"
import EventManagement from "../../../components/admin/event-management"

import { cookies } from "next/headers"
import { prisma } from "@/lib/prisma"

export default async function AdminEventsPage() {
  const cookieStore = cookies()
  const adminSession = cookieStore.get("admin_session")?.value
  if (!adminSession) {
    redirect("/admin/login")
  }

  // Optionally, fetch user info for navbar
  const user = await prisma.user.findUnique({ where: { id: adminSession } })
  if (!user || user.role !== "admin") {
    redirect("/admin/login")
  }

  // Fetch all events from database
  let events: any[] = []
  try {
    const dbEvents = await prisma.event.findMany({
      orderBy: { eventDate: "asc" },
      take: 1000,
    })
    events = dbEvents.map(event => ({
      ...event,
      eventDate: event.eventDate?.toISOString() || null,
      createdAt: event.createdAt.toISOString(),
    }))
    console.log(`Successfully fetched ${events.length} events`)
  } catch (error) {
    console.error("Error fetching events:", error)
  }

  return (
    <div className="min-h-screen bg-background flex">
      <AdminSidebar user={user} />
      <div className="flex-1 lg:ml-0">
        <EventManagement initialEvents={events} />
      </div>
    </div>
  )
}