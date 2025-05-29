"use client"
import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const router = useRouter()

  const handleLogout = () => {
    // Add your logout logic here
    router.push('/signin')
  }

  return (
    <div className="relative">
      <div className="flex flex-col md:flex-row md:items-center md:justify-around bg-white px-4 md:px-6 py-3 shadow">
        {/* Logo and Title */}
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
          
          {/* Mobile Menu Button */}
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
        </div>

        {/* Mobile Menu and Desktop Content */}
        <div className={`${isMenuOpen ? 'flex' : 'hidden'} md:flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-6 mt-4 md:mt-0`}>
          {/* Search Bar */}
          <div className="flex items-center space-x-2">
            <input
              type="text"
              placeholder="Search Caption"
              className="w-full md:w-auto border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <button className="bg-gray-200 px-2 py-1 rounded">
              <svg className="h-4 w-4 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M12.9 14.32a8 8 0 111.414-1.414l4.387 4.387a1 1 0 01-1.414 1.414l-4.387-4.387zM14 8a6 6 0 11-12 0 6 6 0 0112 0z" clipRule="evenodd" />
              </svg>
            </button>
          </div>

          {/* Navigation Links */}
          <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-4">
            <Link href="/home" className="text-sm text-blue-600 hover:underline">Home</Link>
            <Link href="/profile" className="text-sm text-gray-900 font-semibold hover:underline">Profile</Link>
            <button 
              onClick={handleLogout}
              className="bg-blue-500 text-white text-sm px-4 py-1 rounded hover:bg-blue-600 w-full md:w-auto"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Navbar