import { prisma } from "@/lib/prisma"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { apiUrl } from "@/lib/api"
import AdminNavbar from "@/components/admin/admin-navbar"
import EbookManagement from "@/components/admin/ebook-management"

export default async function AdminEbooksPage() {
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

  // Fetch all ebooks from API
  let ebooks = []
  try {
    const response = await fetch(apiUrl('/api/ebooks?limit=1000&published=false'), {
      next: { revalidate: 300 } // Revalidate every 5 minutes
    })
    if (response.ok) {
      const data = await response.json()
      ebooks = data.data || []
    }
  } catch (error) {
    console.error("Error fetching ebooks:", error)
  }

  return (
    <div className="min-h-screen bg-background">
      {user && <AdminNavbar user={user} />}
      <EbookManagement initialEbooks={ebooks} />
    </div>
  )
}
