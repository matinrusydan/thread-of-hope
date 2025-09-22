import { redirect } from "next/navigation"
import AdminNavbar from "@/components/admin/admin-navbar"
import EventCreateForm from "@/components/admin/event-create-form"

import { cookies } from "next/headers"
import { prisma } from "@/lib/prisma"

export default async function AdminEventCreatePage() {
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
      <EventCreateForm />
    </div>
  )
}