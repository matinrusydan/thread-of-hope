import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import AdminSidebar from "@/components/admin/admin-navbar"
import GalleryManagement from "@/components/admin/gallery-management"

export default async function AdminGalleryPage() {
  const cookieStore = cookies()
  const adminSession = cookieStore.get("admin_session")?.value
  if (!adminSession) {
    redirect("/admin/login")
  }
  const user = await prisma.user.findUnique({ where: { id: adminSession } })
  if (!user || user.role !== "admin") {
    redirect("/admin/login")
  }

  // Fetch all gallery items from database
  let galleryItems: any[] = []
  try {
    const dbGalleryItems = await prisma.gallery.findMany({
      orderBy: { createdAt: "desc" },
      take: 1000,
    })
    galleryItems = dbGalleryItems.map(item => ({
      ...item,
      createdAt: item.createdAt.toISOString(),
    }))
  } catch (error) {
    console.error("Error fetching gallery items:", error)
  }

  return (
    <div className="min-h-screen bg-background flex">
      <AdminSidebar user={user} />
      <div className="flex-1 lg:ml-0">
        <GalleryManagement initialGalleryItems={galleryItems} />
      </div>
    </div>
  )
}