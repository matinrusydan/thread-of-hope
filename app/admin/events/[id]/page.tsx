import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import AdminNavbar from "@/components/admin/admin-navbar"
import EventEditForm from "@/components/admin/event-edit-form"

export default async function AdminEventEditPage({
  params,
}: {
  params: { id: string }
}) {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== 'admin') {
    redirect("/")
  }

  return (
    <div className="min-h-screen bg-background">
      <AdminNavbar user={session.user} />
      <EventEditForm eventId={params.id} />
    </div>
  )
}