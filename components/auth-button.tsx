"use client"


import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

export default function AuthButton() {
  const router = useRouter()
  // TODO: Replace with custom admin session check if needed
  // For now, just show login button
  return (
    <Button onClick={() => router.push("/admin/login")} variant="outline" size="sm">
      Admin Login
    </Button>
  )
}
