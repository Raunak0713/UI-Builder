'use client'

import getTotalCredits from '@/actions/getTotalCredits'
import { SignInButton, SignUpButton, UserButton, useUser } from '@clerk/nextjs'
import { Bolt } from 'lucide-react'
import { useTheme } from "next-themes"
import Link from 'next/link'
import { usePathname } from 'next/navigation'; // Use usePathname instead of useRouter
import { useEffect, useState } from 'react'
import { ModeToggle } from './ModeToggle'
import { Button } from './ui/button'

const Navbar = () => {
  const { user } = useUser()
  const [scrolled, setScrolled] = useState(false)
  const { theme } = useTheme()
  const [totalCredits, setTotalCredits] = useState(0)
  const pathname = usePathname() // Get the current pathname

  // Fetch credits only if the user is on the homepage
  useEffect(() => {
    const getCredits = async () => {
      if (user && pathname === "/") {
        try {
          const credits = await getTotalCredits()
          setTotalCredits(credits)
        } catch (error) {
          console.log("Error fetching credits", error)
        }
      }
    }
    getCredits()
  }, [user, pathname]) // Add pathname as a dependency

  // Handle scroll event
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 0
      setScrolled(isScrolled)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className={`
      border-b-2 
      p-4 
      -mb-0.5 
      flex 
      flex-row 
      justify-between 
      items-center 
      sticky 
      top-0 
      transition-all 
      duration-300
      z-50
      ${scrolled ? 
        'bg-background/70 backdrop-blur-md border-b-2 border-border/50' : 
        'bg-background'
      }
    `}>
      <div className='text--600 flex text-xl md:text-2xl gap-1 md:gap-3 font-semibold items-center'>
        <Link href={"/"} className='flex items-center gap-2'>
          <Bolt size={35} />
          UI Builder
        </Link>
      </div>
      <div className='space-x-2 md:space-x-4 flex items-center'>
        {user ? (
          <div className="flex items-center gap-3">
            {pathname === "/" && ( // Conditionally render total credits based on pathname
              <div className={`px-2 py-1 md:px-3 md:py-2 rounded-lg text-white bg-gray-600 font-semibold shadow-md
              `}>
                Total Credits : {totalCredits}
              </div>
            )}
            <ModeToggle />
            <UserButton />
          </div>
        ) : (
          <div className='space-x-2 md:space-x-4 flex items-center'>
            <ModeToggle />
            <SignInButton>
              <Button className='bg-gray-700 text-white hover:bg-gray-600'>Sign In</Button>
            </SignInButton>
            <SignUpButton>
              <Button className='bg-gray-700 text-white hover:bg-gray-600'>Sign Up</Button>
            </SignUpButton>
          </div>
        )}
      </div>
    </div>
  )
}

export { Navbar }
