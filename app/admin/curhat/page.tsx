import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import AdminNavbar from "@/components/admin/admin-navbar"
import CurhatManagement from "@/components/admin/curhat-management"

import { cookies } from "next/headers"

export default async function AdminCurhatPage() {
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
      <AdminNavbar user={user} />
      <CurhatManagement initialStories={stories} />
    </div>
  )
}
