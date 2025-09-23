import { prisma } from "@/lib/prisma"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import AdminSidebar from "@/components/admin/admin-navbar"
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

  // Fetch all ebooks from database
  let ebooks: any[] = []
  try {
    const dbEbooks = await prisma.ebook.findMany({
      orderBy: { createdAt: "desc" },
      take: 1000,
    })
    ebooks = dbEbooks.map(ebook => ({
      ...ebook,
      description: ebook.description || '',
      createdAt: ebook.createdAt.toISOString(),
    }))
  } catch (error) {
    console.error("Error fetching ebooks:", error)
  }

  return (
    <div className="min-h-screen bg-background flex">
      <AdminSidebar user={user} />
      <div className="flex-1 lg:ml-0">
        <EbookManagement initialEbooks={ebooks} />
      </div>
    </div>
  )
}
