"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { ModeToggle } from '@/components/mode-toggle'
import { UserButton, SignInButton, SignUpButton, useUser } from '@clerk/nextjs'
import { UserCircle, Menu, X, LayoutDashboard, CreditCard, PieChart, Settings } from 'lucide-react'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'

export default function Header() {
  const pathname = usePathname()
  const { user, isLoaded } = useUser()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  const isLandingPage = pathname === '/'
  const isLoggedIn = isLoaded && !!user

  const navigationItems = [
    { name: 'Dashboard', href: '/dashboard', icon: <LayoutDashboard className="h-5 w-5 mr-2" /> },
    { name: 'Accounts', href: '/accounts', icon: <CreditCard className="h-5 w-5 mr-2" /> },
    { name: 'Transactions', href: '/transactions', icon: <PieChart className="h-5 w-5 mr-2" /> },
    { name: 'Settings', href: '/settings', icon: <Settings className="h-5 w-5 mr-2" /> },
  ]

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        isScrolled ? 'bg-background/80 backdrop-blur-md border-b' : isLandingPage ? 'bg-transparent' : 'bg-background border-b'
      }`}
    >
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center">
          <Link href="/" className="flex items-center font-bold text-xl">
            <CreditCard className="h-6 w-6 mr-2 text-primary" />
            <span>FinTrack</span>
          </Link>
        </div>

        {/* Desktop navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {isLoggedIn ? (
            <>
              {navigationItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center text-sm font-medium transition-colors hover:text-primary ${
                    pathname === item.href ? 'text-primary' : 'text-muted-foreground'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </>
          ) : (
            isLandingPage && (
              <>
                <Link href="#features" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                  Features
                </Link>
               
              </>
            )
          )}
        </nav>

        <div className="flex items-center gap-4">
          <ModeToggle />

          {isLoggedIn ? (
            <UserButton 
              afterSignOutUrl="/"
            />
          ) : (
            <div className="hidden md:flex gap-2">
              <SignInButton mode="modal">
                <Button variant="outline">Log in</Button>
              </SignInButton>
              <SignUpButton mode="modal">
                <Button>Sign up</Button>
              </SignUpButton>
            </div>
          )}

          {/* Mobile menu button */}
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <div className="flex flex-col gap-6 h-full">
                <div className="flex justify-between items-center">
                  <Link href="/" className="flex items-center font-bold text-xl" onClick={() => setIsMobileMenuOpen(false)}>
                    <CreditCard className="h-6 w-6 mr-2 text-primary" />
                    <span>FinTrack</span>
                  </Link>
                  <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(false)}>
                    <X className="h-6 w-6" />
                  </Button>
                </div>

                <div className="flex flex-col gap-4">
                  {isLoggedIn ? (
                    navigationItems.map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        className={`flex items-center py-2 text-base font-medium transition-colors hover:text-primary ${
                          pathname === item.href ? 'text-primary' : 'text-muted-foreground'
                        }`}
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {item.icon}
                        {item.name}
                      </Link>
                    ))
                  ) : (
                    isLandingPage && (
                      <>
                        <Link 
                          href="#features" 
                          className="py-2 text-base font-medium text-muted-foreground hover:text-primary transition-colors"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          Features
                        </Link>
                        <Link 
                          href="#pricing" 
                          className="py-2 text-base font-medium text-muted-foreground hover:text-primary transition-colors"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          Pricing
                        </Link>
                      </>
                    )
                  )}
                </div>

                <div className="mt-auto">
                  {isLoggedIn ? (
                    <div className="flex items-center gap-3 mb-4">
                      <UserButton 
                        afterSignOutUrl="/"
                      />
                      <div>
                        <p className="font-medium">{user?.fullName || user?.username || 'User'}</p>
                        <p className="text-sm text-muted-foreground">{user?.primaryEmailAddress?.emailAddress}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-2">
                      <SignInButton mode="modal">
                        <Button variant="outline" className="w-full" onClick={() => setIsMobileMenuOpen(false)}>Log in</Button>
                      </SignInButton>
                      <SignUpButton mode="modal">
                        <Button className="w-full" onClick={() => setIsMobileMenuOpen(false)}>Sign up</Button>
                      </SignUpButton>
                    </div>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}