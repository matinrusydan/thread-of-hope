import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { apiUrl } from "@/lib/api"
import AdminNavbar from "@/components/admin/admin-navbar"
import GalleryManagement from "@/components/admin/gallery-management"
import { cookies } from "next/headers"
import { prisma } from "@/lib/prisma"

export default async function AdminGalleryPage() {
  const session = await getServerSession(authOptions)

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

  // Fetch all gallery items from API
  let galleryItems = []
  try {
    const response = await fetch(apiUrl('/api/gallery?limit=1000'), {
      cache: 'force-cache',
      next: { revalidate: 300 } // Revalidate every 5 minutes
    })
    if (response.ok) {
      const data = await response.json()
      galleryItems = data.data || []
    }
  } catch (error) {
    console.error("Error fetching gallery items:", error)
  }

  return (
    <div className="min-h-screen bg-background">
        <AdminNavbar user={user} />
      <GalleryManagement initialGalleryItems={galleryItems} />
    </div>
  )
}