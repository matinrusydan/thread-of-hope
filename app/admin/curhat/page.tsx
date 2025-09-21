import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import AdminNavbar from "@/components/admin/admin-navbar"
import CurhatManagement from "@/components/admin/curhat-management"

export default async function AdminCurhatPage() {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== 'admin') {
    redirect("/")
  }

  // Fetch all curhat stories directly from database
  let stories = []
  try {
    stories = await prisma.curhat.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        title: true,
        content: true,
        authorName: true,
        isApproved: true,
        createdAt: true,
        updatedAt: true,
      },
    })
  } catch (error) {
    console.error("Error fetching stories:", error)
  }

  return (
    <div className="min-h-screen bg-background">
      <AdminNavbar user={session.user} />
      <CurhatManagement initialStories={stories} />
    </div>
  )
}
