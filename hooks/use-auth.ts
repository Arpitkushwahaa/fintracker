"use client"

import { useUser, useClerk } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'

export const useAuth = () => {
  const { user, isLoaded, isSignedIn } = useUser()
  const { signOut } = useClerk()
  const router = useRouter()
  
  return {
    user: user,
    isLoading: !isLoaded,
    isAuthenticated: isSignedIn,
    signOut: async () => {
      await signOut()
      router.push('/')
    },
    signUp: () => router.push('/sign-up'),
    signIn: () => router.push('/sign-in')
  }
}