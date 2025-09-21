import { redirect } from "next/navigation"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import AdminNavbar from "@/components/admin/admin-navbar"
import AdminDashboard from "@/components/admin/admin-dashboard"

export default async function AdminPage() {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== 'admin') {
    redirect("/")
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
    <div className="min-h-screen bg-background">
      <AdminNavbar user={session.user} />
      <AdminDashboard stats={stats} />
    </div>
  )
}
