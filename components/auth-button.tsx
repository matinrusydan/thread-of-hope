"use client"

import { signOut, useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

export default function AuthButton() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const loading = status === "loading"

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/" })
  }

  if (loading) {
    return <div className="w-20 h-8 bg-gray-200 animate-pulse rounded"></div>
  }

  if (session?.user) {
    return (
      <div className="flex items-center gap-2">
        {session.user.role === 'admin' && (
          <Button onClick={() => router.push("/admin")} variant="outline" size="sm">
            Admin Panel
          </Button>
        )}
        <span className="text-sm text-muted-foreground hidden sm:inline">{session.user.email}</span>
        <Button onClick={handleSignOut} variant="destructive" size="sm">
          Sign Out
        </Button>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-2">
      <Button onClick={() => router.push("/auth/login")} variant="default" size="sm">
        Login
      </Button>
      <Button onClick={() => router.push("/auth/sign-up")} variant="outline" size="sm">
        Sign Up
      </Button>
    </div>
  )
}
