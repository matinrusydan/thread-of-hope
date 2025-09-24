import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import AdminSidebar from "@/components/admin/admin-navbar"
import CurhatManagement from "@/components/admin/curhat-management"

import { cookies } from "next/headers"

export const dynamic = 'force-dynamic'

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
  let stories: {
    id: string;
    title: string;
    content: string;
    authorName: string;
    isApproved: boolean;
    createdAt: string;
    updatedAt: string;
  }[] = []
  try {
    const dbStories = await prisma.curhat.findMany({
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
    stories = dbStories.map(story => ({
      ...story,
      createdAt: story.createdAt.toISOString(),
      updatedAt: story.updatedAt.toISOString()
    }))
  } catch (error) {
    console.error("Error fetching stories:", error)
  }

  return (
    <div className="min-h-screen bg-background flex">
      <AdminSidebar user={user} />
      <div className="flex-1 lg:ml-0">
        <CurhatManagement initialStories={stories} />
      </div>
    </div>
  )
}
