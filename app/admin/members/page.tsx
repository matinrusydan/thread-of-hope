import { redirect } from "next/navigation"
import AdminNavbar from "@/components/admin/admin-navbar"
import MemberManagement from "@/components/admin/member-management"

import { cookies } from "next/headers"
import { prisma } from "@/lib/prisma"

export default async function AdminMembersPage() {
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

  // Fetch all community members from database
  let members: any[] = []
  try {
    const dbMembers = await prisma.communityMember.findMany({
      orderBy: { joinedAt: "desc" },
      take: 1000,
    })
    members = dbMembers.map(member => ({
      ...member,
      joinedAt: member.joinedAt.toISOString(),
    }))
  } catch (error) {
    console.error("Error fetching members:", error)
  }

  return (
    <div className="min-h-screen bg-background">
      <AdminNavbar user={user} />
      <MemberManagement initialMembers={members} />
    </div>
  )
}
