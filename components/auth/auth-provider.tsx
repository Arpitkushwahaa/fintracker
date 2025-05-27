"use client"

import { createContext, useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'

type User = {
  id: string
  name?: string | null
  email: string
  image?: string | null
}

type AuthContextType = {
  user: User | null
  isLoading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (name: string, email: string, password: string) => Promise<void>
  signOut: () => void
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  signIn: async () => {},
  signUp: async () => {},
  signOut: () => {},
})

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  // Check for existing session on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // This would be a fetch to your API to validate the session
        const storedUser = localStorage.getItem('fintrack_user')
        if (storedUser) {
          setUser(JSON.parse(storedUser))
        }
      } catch (error) {
        console.error('Auth check failed:', error)
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [])

  // Protected routes logic
  useEffect(() => {
    if (!isLoading) {
      const publicRoutes = ['/', '/login', '/signup']
      const isPublicRoute = publicRoutes.includes(pathname)

      if (!user && !isPublicRoute) {
        router.push('/login')
      } else if (user && (pathname === '/login' || pathname === '/signup')) {
        router.push('/dashboard')
      }
    }
  }, [user, isLoading, pathname, router])

  // Auth functions
  const signIn = async (email: string, password: string) => {
    setIsLoading(true)
    try {
      // This would be a fetch to your API to authenticate
      // Mocking successful authentication for demo
      const mockUser = {
        id: 'user_123',
        name: 'Demo User',
        email: email,
        image: null,
      }
      
      setUser(mockUser)
      localStorage.setItem('fintrack_user', JSON.stringify(mockUser))
      router.push('/dashboard')
    } catch (error) {
      console.error('Sign in failed:', error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const signUp = async (name: string, email: string, password: string) => {
    setIsLoading(true)
    try {
      // This would be a fetch to your API to register
      // Mocking successful registration for demo
      const mockUser = {
        id: 'user_123',
        name: name,
        email: email,
        image: null,
      }
      
      setUser(mockUser)
      localStorage.setItem('fintrack_user', JSON.stringify(mockUser))
      router.push('/dashboard')
    } catch (error) {
      console.error('Sign up failed:', error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const signOut = () => {
    setUser(null)
    localStorage.removeItem('fintrack_user')
    router.push('/')
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}