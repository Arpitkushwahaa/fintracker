"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function LoginPage() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to the new sign-in page
    router.replace("/sign-in")
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center">
        <h2 className="text-2xl font-bold">Redirecting to login...</h2>
        <p className="mt-2 text-muted-foreground">Please wait while we redirect you to the login page.</p>
      </div>
    </div>
  )
}