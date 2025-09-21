import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { apiUrl } from "@/lib/api"
import AdminNavbar from "@/components/admin/admin-navbar"
import EventManagement from "../../../components/admin/event-management"

export default async function AdminEventsPage() {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== 'admin') {
    redirect("/")
  }

  // Fetch all events from API using production-ready URL
  let events = []
  try {
    // ✅ PRODUCTION-READY: Automatically detects environment
    const fullApiUrl = apiUrl('/api/events?limit=1000')
    console.log('Fetching events from:', apiUrl) // For debugging

    const response = await fetch(fullApiUrl, {
      cache: 'force-cache',
      next: { revalidate: 300 } // Revalidate every 5 minutes
    })

    if (response.ok) {
      const data = await response.json()
      events = data.data || []
      console.log(`Successfully fetched ${events.length} events`)
    } else {
      console.error(`Failed to fetch events: ${response.status} ${response.statusText}`)
    }
  } catch (error) {
    console.error("Error fetching events:", error)
    // In production, you might want to show a user-friendly error
    // or fall back to a different data source
  }

  return (
    <div className="min-h-screen bg-background">
      <AdminNavbar user={session.user} />
      <EventManagement initialEvents={events} />
    </div>
  )
}