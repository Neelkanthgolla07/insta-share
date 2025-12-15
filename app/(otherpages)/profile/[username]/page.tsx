"use client"
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import {useParams} from 'next/navigation'
import React, { useEffect, useState } from 'react'
import Image from 'next/image'
interface UserProfile {
  name: string;
  followers: number;
  following: number;
  // posts: number;
}
interface PostDetails {
  caption: string;
  image_url: string;
}

interface Post {
  post_id: string;
  post_details: PostDetails;
  created_at: string;
  user_name: string;
  likes: string[];
  comments: string[];
  _id: string;
}
 

const Page = () => {
    const router =useRouter()
    const { data: session, status } = useSession();
    const [posts, setPosts] = useState<Post[]>([]);
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
    const {username}= useParams<{ username: string }>()
    const [isFollowing, setIsFollowing] = useState(false);
    
    useEffect(() => {
        if (status === 'unauthenticated') {
          router.replace('/signin')
        }
      }, [status, router])
    
    
    useEffect(() => {
    const fetchUserProfile = async () => {
    try {
             const [profileRes, postsRes] = await Promise.all([
            fetch(`/api/users/${username}`),
            fetch(`/api/posts`)
          ]);
    
          if (profileRes.ok && postsRes.ok) {
            const [profileData, allPostsData] = await Promise.all([
              profileRes.json(),
              postsRes.json()
            ]);
            setUserProfile(profileData.user);
            
            console.log("Profile Data:", profileData);
            const postsData = allPostsData.filter((post:Post)=> post.user_name===username)
            setIsFollowing(profileData.followers.includes(session?.user?.name));
            setPosts(postsData);
          }
            } catch (error) {
              console.error('Error fetching user profile:', error)
            }
          }
      fetchUserProfile()
        },[username, status, session?.user?.name])
        

    const isValidImageUrl = (url: string) => {
      return url && (
        url.startsWith('http') || 
        url.startsWith('data:image/') || 
        url.startsWith('/') // for local images
      );
    };

    const handleFollowToggle = async () => {
      console.log("Toggling follow for:", username);
    try {
      const res = await fetch(`/api/users/${username}/follow`, {
        method: isFollowing ? 'DELETE' : 'POST',
        headers: {
        'Content-Type': 'application/json'
      }
      });

      if (res.ok) {
        
        setIsFollowing(!isFollowing);
        // Update followers count
        setUserProfile(prev => prev ? {
          ...prev,
          followers: prev.followers + (isFollowing ? -1 : 1)
        } : null);
      }
    } catch (error) {
      console.error('Error toggling follow:', error);
    }
  };


  return (
    <div>
      <div className="max-w-4xl mx-auto p-4">

        {/* Profile Header */}
        <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6 mb-8">
          {/* Profile Picture */}
          <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-200">
            <Image
              src="/avatar.png"
              alt={username || "Profile"}
              width={128}
              height={128}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Profile Info */}
          <div className="flex-1">
            <div className="mb-4 flex items-center">
              <h1 className="text-2xl mr-3  font-semibold">{username}</h1>
              
                <button
                  onClick={handleFollowToggle}
                  className={`px-4 py-2 rounded-md ${
                    isFollowing 
                      ? 'bg-gray-200 text-black' 
                      : 'bg-blue-500 text-white'
                  }`}
                >
                  {isFollowing ? 'Following' : 'Follow'}
                </button>
              
            </div>
            <div className="flex space-x-6">
              <div>
                <span className="font-semibold">{posts.length || 0}</span> posts
              </div>
              <div>
                <span className="font-semibold">{userProfile?.followers || 0}</span> followers
              </div>
              <div>
                <span className="font-semibold">{userProfile?.following || 0}</span> following
              </div>
            </div>
          </div>
        </div>

        {/* Posts Grid */}
        <div className="grid grid-cols-3 gap-4">
           {posts.length > 0 ? (
              posts.map((post) => (
                <div key={`post-${post._id}`} className="relative group">
                  <div className="aspect-square relative overflow-hidden">
                    {isValidImageUrl(post.post_details.image_url) ? (
                      <Image
                        src={post.post_details.image_url}
                        alt={post.post_details.caption || 'Post image'}
                        fill
                        className="object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = '/placeholder-image.png'; // Add a placeholder image
                        }}
                      />
                    ) : (
                      <div className="w-full h-ful bg-gray-200 flex items-center justify-center">
                        <span className="text-gray-400">Image not available</span>
                      </div>
                    )}
                  </div>
                  {post.post_details.caption && (
                    <p className="mt-2 text-sm text-gray-600 truncate">{post.post_details.caption}</p>
                  )}
                </div>
              ))
                    ) : (
                      <div className="co-span-3 text-center py-10 text-gray-500">
                        No posts yet
                      </div>
                    )}
        </div>
      </div>
    </div>
  )
}

export default Page
