import { redirect } from "next/navigation"
import AdminNavbar from "@/components/admin/admin-navbar"
import EbookCreateForm from "@/components/admin/ebook-create-form"

import { cookies } from "next/headers"
import { prisma } from "@/lib/prisma"

export default async function AdminEbookCreatePage() {
  const cookieStore = cookies()
  const adminSession = cookieStore.get("admin_session")?.value
  if (!adminSession) {
    redirect("/admin/login")
  }
  const user = await prisma.user.findUnique({ where: { id: adminSession } })
  if (!user || user.role !== "admin") {
    redirect("/admin/login")
  }
  return (
    <div className="min-h-screen bg-background">
      <AdminNavbar user={user} />
      <EbookCreateForm />
    </div>
  )
}