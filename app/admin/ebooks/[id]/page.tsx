import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import AdminSidebar from "@/components/admin/admin-navbar"
import EbookEditForm from "@/components/admin/ebook-edit-form"

export default async function AdminEbookEditPage({
  params,
}: {
  params: { id: string }
}) {
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
    <div className="min-h-screen bg-background flex">
      <AdminSidebar user={user} />
      <div className="flex-1 lg:ml-0">
        <EbookEditForm ebookId={params.id} />
      </div>
    </div>
  )
}