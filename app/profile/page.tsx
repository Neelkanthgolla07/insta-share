'use client'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import Navbar from '@/components/navbar'
import Image from 'next/image'

interface UserProfile {
  name: string;
  followers: number;
  following: number;
  posts: number;
}

const Profile = () => {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace('/signin')
    }
  }, [status, router])

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (session?.user?.name) {
        try {
          const response = await fetch(`/api/users/${session.user.name}`)
          if (response.ok) {
            const data = await response.json()
            setUserProfile(data)
          }
        } catch (error) {
          console.error('Error fetching user profile:', error)
        }
      }
    }

    if (session) {
      fetchUserProfile()
    }
  }, [session])

  if (status === 'loading') {
    return <div>Loading...</div>
  }

  if (!session) {
    return null
  }

  return (
    <div>
      <Navbar />
      <div className="max-w-4xl mx-auto p-4">
        {/* Profile Header */}
        <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6 mb-8">
          {/* Profile Picture */}
          <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-200">
            <Image
              src="/avatar.png"
              alt={session.user?.name || "Profile"}
              width={128}
              height={128}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Profile Info */}
          <div className="flex-1">
            <div className="mb-4">
              <h1 className="text-2xl font-semibold">{session.user?.name}</h1>
              <p className="text-gray-600 text-sm mt-2">
                No bio yet
              </p>
            </div>

            {/* Stats */}
            <div className="flex space-x-6 mb-4">
              <div className="text-center">
                <span className="font-semibold">{userProfile?.posts || 0}</span>
                <span className="text-gray-500 block">posts</span>
              </div>
              <div className="text-center">
                <span className="font-semibold">{userProfile?.followers || 0}</span>
                <span className="text-gray-500 block">followers</span>
              </div>
              <div className="text-center">
                <span className="font-semibold">{userProfile?.following || 0}</span>
                <span className="text-gray-500 block">following</span>
              </div>
            </div>
          </div>
        </div>

        {/* Posts Grid */}
        <div className="border-t pt-8">
          <div className="grid grid-cols-3 gap-1 md:gap-4">
            {/* Empty state */}
            <div className="aspect-square bg-gray-100 flex items-center justify-center">
              <span className="text-gray-400">No Posts Yet</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile
