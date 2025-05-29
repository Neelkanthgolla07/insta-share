'use client'
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

const Navbar = () => {
  const router = useRouter()
  const { data: session } = useSession()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  useEffect(() => {
    if (!session) {
      router.push('/signin')
    }
  }, [session, router])

  return (
    <nav className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Image 
              src="/logo.png" 
              alt="Logo" 
              width={44} 
              height={24}
              className="h-6 w-11" 
            />
            <span className="text-lg font-semibold text-gray-900">Insta Share</span>
          </div>
          <button 
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg className="h-6 w-6" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
              {isMenuOpen ? (
                <path d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
          
          <div className={`${isMenuOpen ? 'block' : 'hidden'} md:block`}>
            <div className="flex items-center space-x-4">
              <Link href="/home" className="text-gray-600 hover:text-gray-900">Home</Link>
              <Link href="/profile" className="text-gray-600 hover:text-gray-900">Profile</Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar