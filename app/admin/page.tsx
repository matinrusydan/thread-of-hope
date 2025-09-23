import { cookies } from "next/headers"
import { prisma } from "@/lib/prisma"
import AdminSidebar from "@/components/admin/admin-navbar"
import AdminDashboard from "@/components/admin/admin-dashboard"
import { redirect } from "next/navigation"

export default async function AdminPage() {
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

  // Fetch dashboard stats
  const [pendingCurhat, totalEbooks, totalGallery, totalMembers] = await Promise.all([
    prisma.curhat.count({ where: { isApproved: false } }),
    prisma.ebook.count(),
    prisma.gallery.count(),
    prisma.communityMember.count(),
  ])

  const stats = {
    pendingCurhat,
    totalEbooks,
    totalGallery,
    totalMembers,
  }

  return (
    <div className="min-h-screen bg-background flex">
      <AdminSidebar user={user} />
      <div className="flex-1 lg:ml-0">
        <AdminDashboard stats={stats} />
      </div>
    </div>
  )
}
