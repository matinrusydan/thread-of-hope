import { redirect } from "next/navigation"
import AdminNavbar from "@/components/admin/admin-navbar"
import EventEditForm from "@/components/admin/event-edit-form"

import { cookies } from "next/headers"
import { prisma } from "@/lib/prisma"

export default async function AdminEventEditPage({ params }: { params: { id: string } }) {
  const cookieStore = cookies()
  const adminSession = cookieStore.get("admin_session")?.value
  if (!adminSession) {
    redirect("/admin/login")
  }
  const user = await prisma.user.findUnique({ where: { id: adminSession } })
  if (!user || user.role !== "admin") {
    redirect("/admin/login")
  }
  return (
    <div className="min-h-screen bg-background">
      <AdminNavbar user={user} />
      <EventEditForm eventId={params.id} />
    </div>
  )
}