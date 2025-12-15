"use client"
import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { signOut } from 'next-auth/react'
import { useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
// import { useState, useEffect } from 'react'

interface SearchUser {
  name: string;
  profile_pic?: string;
}

const Navbar = () => {
  const router= useRouter()
  const {status}= useSession()
  // console.log("yep")
  useEffect(() => {
      if (status === 'unauthenticated') {
        router.replace('/signin')
      }
    }, [status, router])
  
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  // const [searchTerm, setSearchTerm] = useState('')
  const [searchResults, setSearchResults] = useState<SearchUser[]>([])

  const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
    // await console.log("ihdginbvik")
    // alert('Search triggered')
    const value = e.target.value
    // console.log('Search function triggered') // Add this line
    // const value = e.target.value
    // console.log('Search value:', value)
    // console.log('Encoded value:', encodeURIComponent(value))
    // setSearchTerm(value)

    if (value.trim()) {
      try {
        const res = await fetch(`/api/users/search?q=${encodeURIComponent(value)}`)
        // console.log(encodeURIComponent(value))

        if (res.ok) {
          const data = await res.json()
          setSearchResults(data)
        }
      } catch (error) {
        console.error('Error searching users:', error)
      }
    } else {
      setSearchResults([])
    }
  }

  const handleLogout = async () => {
    // Add your logout logic here
    await signOut({ callbackUrl: '/signin' })
  }
  const handleBlur = () => {
    // Use setTimeout to allow clicking on search results before they disappear
    setTimeout(() => {
      setSearchResults([]);
    }, 200);
  };

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
        <div className={`${isMenuOpen ? 'flex' : 'hidden'} md:flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-6 mt-4 md:mt-0`}>          {/* Search Bar */}
          <div className="relative flex items-center space-x-2">
            <input
              type="text"
              placeholder="Search users..."
              className="w-full md:w-64 border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              onChange={handleSearch}
              onBlur={handleBlur}
            />
            <div className={`absolute top-full left-0 w-full mt-1 bg-white border rounded-lg shadow-lg ${searchResults.length > 0 ? 'block' : 'hidden'}`}>
              {searchResults.map((user) => (
                <Link
                  key={user.name}
                  href={`/profile/${user.name}`}
                  className="flex items-center px-4 py-2 hover:bg-gray-50"
                  onClick={(e) => {
                    e.preventDefault(); // Prevent immediate navigation
                    setSearchResults([]); // Clear search results
                    setIsMenuOpen(false);
                    console.log(`Navigating to profile of ${user.name}`);
                    router.push(`/profile/${user.name}`); // Programmatically navigate
                  }}
                >

                  <Image
                    src={user.profile_pic || "/avatar.png"}
                    alt={user.name}
                    width={32}
                    height={32}
                    className="w-8 h-8 rounded-full mr-2"
                  />
                  <span>{user.name}</span>
                </Link>
              ))}
            </div>
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