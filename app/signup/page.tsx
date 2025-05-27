"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function SignupPage() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to the new sign-up page
    router.replace("/sign-up")
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center">
        <h2 className="text-2xl font-bold">Redirecting to sign up...</h2>
        <p className="mt-2 text-muted-foreground">Please wait while we redirect you to the sign up page.</p>
      </div>
    </div>
  )
}