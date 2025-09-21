import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import AdminNavbar from "@/components/admin/admin-navbar"
import GalleryCreateForm from "@/components/admin/gallery-create-form"

export default async function AdminGalleryCreatePage() {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== 'admin') {
    redirect("/")
  }

  return (
    <div className="min-h-screen bg-background">
      <AdminNavbar user={session.user} />
      <GalleryCreateForm />
    </div>
  )
}