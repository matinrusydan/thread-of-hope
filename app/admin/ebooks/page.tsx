import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import AdminNavbar from "@/components/admin/admin-navbar"
import EbookManagement from "@/components/admin/ebook-management"
import { apiUrl } from "@/lib/api"

export default async function AdminEbooksPage() {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== 'admin') {
    redirect("/")
  }

  // Fetch all ebooks from API
  let ebooks = []
  try {
    const response = await fetch(apiUrl('/api/ebooks?limit=1000&published=false'), {
      cache: 'force-cache',
      next: { revalidate: 300 } // Revalidate every 5 minutes
    })
    if (response.ok) {
      const data = await response.json()
      ebooks = data.data || []
    }
  } catch (error) {
    console.error("Error fetching ebooks:", error)
  }

  return (
    <div className="min-h-screen bg-background">
      <AdminNavbar user={session.user} />
      <EbookManagement initialEbooks={ebooks} />
    </div>
  )
}
