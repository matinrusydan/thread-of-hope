import { redirect } from "next/navigation"
import { apiUrl } from "@/lib/api"
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

  // Fetch all community members from API
  let members = []
  try {
    const response = await fetch(apiUrl('/api/community?limit=1000'), {
      cache: 'force-cache',
      next: { revalidate: 60 } // Revalidate every minute
    })
    if (response.ok) {
      const data = await response.json()
      members = data.data || []
    }
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
