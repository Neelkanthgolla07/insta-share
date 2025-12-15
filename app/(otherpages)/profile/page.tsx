'use client'
import CreatePost from '@/components/CreatePost'
import { useSession } from 'next-auth/react'
import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import EditPost from '@/components/EditPost'

interface UserProfile {
  name: string;
  followers: string[];
  following: string[];
  // posts: number;
}
interface PostDetails {
  caption: string;
  image_url: string;
}

interface Comment {
  user_name: string;
  user_id: string;
  comment: string;
}

interface Post {
  post_id: string;
  post_details: PostDetails;
  created_at: string;
  user_name: string;
  likes: string[];
  comments: Comment[];
  _id: string;
}


const Profile = () => {
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const { data: session} = useSession()
  const [posts, setPosts] = useState<Post[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const[refresh , setRefresh] = useState("false")
  

   
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (session?.user?.name) {
        try {
         const [profileRes, postsRes] = await Promise.all([
        fetch(`/api/users/${session.user.name}`),
        fetch(`/api/posts`)
      ]);

      if (profileRes.ok && postsRes.ok) {
        const [profileData, allPostsData] = await Promise.all([
          profileRes.json(),
          postsRes.json()
        ]);
        setUserProfile(profileData);
        console.log(allPostsData)
        console.log(session.user.name)
        const postsData = allPostsData.filter((post:Post)=> post.user_name===session.user?.name)
        console.log(postsData)
        setPosts(postsData);
      }
        } catch (error) {
          console.error('Error fetching user profile:', error)
        }
      }

    }
    setRefresh("false")
    if (session) {
      fetchUserProfile()
    }
  }, [session,refresh ])


  const handleDeletePost = async (postId: string) => {
  if (!confirm('Are you sure you want to delete this post?')) return;

  try {
    const res = await fetch(`/api/posts/${postId}`, {
      method: 'DELETE',
    });

    if (res.ok) {
      // Remove the deleted post from state
      setPosts(posts.filter(post => post._id !== postId));
      // Update the posts count in user profile
      setRefresh("true")
    }
  } catch (error) {
    console.error('Error deleting post:', error);
  }
};
  
const isValidImageUrl = (url: string) => {
  return url && (
    url.startsWith('http') || 
    url.startsWith('data:image/') || 
    url.startsWith('/') // for local images
  );
};
  // Search functionality
  // useEffect(() => {
  //   const searchUsers = async () => {
  //     if (searchTerm.trim()) {
  //       setIsSearching(true)
  //       try {
  //         const response = await fetch(`/api/users/search?q=${searchTerm}`)
  //         if (response.ok) {
  //           const data = await response.json()
  //           setSearchResults(data)
  //         }
  //       } catch (error) {
  //         console.error('Error searching users:', error)
  //       } finally {
  //         setIsSearching(false)
  //       }
  //     } else {
  //       setSearchResults([])
  //     }
  //   }

  //   const debounceTimer = setTimeout(searchUsers, 300)
  //   return () => clearTimeout(debounceTimer)
  // }, [searchTerm])

  // if (status === 'loading') {
  //   return <div>Loading...</div>
  // }

  if (!session) {
    return null
  }

  return (
    <div>
      <div className="max-w-4xl mx-auto p-4">
        {/* Search Bar */}
        {/* <div className="mb-6">
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {searchTerm && (
            <div className="mt-2 bg-white rounded-lg shadow-lg absolute z-10 w-[calc(100%-2rem)]">
              {isSearching ? (
                <div className="p-4 text-center">Searching...</div>
              ) : searchResults.length > 0 ? (
                <div className="max-h-64 overflow-y-auto">
                  {searchResults.map((user) => (
                    <Link
                      key={user.name}
                      href={`/profile/${user.name}`}
                      className="flex items-center p-3 hover:bg-gray-50"
                    >
                      <Image
                        src={user.profile_pic || '/avatar.png'}
                        alt={user.name}
                        width={40}
                        height={40}
                        className="rounded-full"
                      />
                      <span className="ml-3">{user.name}</span>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="p-4 text-center text-gray-500">No users found</div>
              )}
            </div>
          )}
        </div> */}

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
            </div>
            <div className="flex space-x-6">
              <div>
                <span className="font-semibold">{posts.length || 0}</span> posts
              </div>
              <div>
                <span className="font-semibold">{userProfile?.followers?.length || 0}</span> followers
              </div>
              <div>
                <span className="font-semibold">{userProfile?.following?.length || 0}</span> following
              </div>
            </div>
          </div>
        </div>

        {/* Create Post Section */}
        <CreatePost setRefresh = {setRefresh}/>

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
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              <span className="text-gray-400">Image not available</span>
            </div>
          )}
          <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <button
              onClick={() => setEditingPost(post)}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
            >
              Edit
            </button>
            <button
              onClick={() => handleDeletePost(post._id)}
              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
            >
              Delete
            </button>
          </div>
        </div>
        {post.post_details.caption && (
          <p className="mt-2 text-sm text-gray-600 truncate">{post.post_details.caption}</p>
        )}
      </div>
    ))
          ) : (
            <div className="col-span-3 text-center py-10 text-gray-500">
              No posts yet
            </div>
          )}
          {editingPost && (
              <EditPost
                post={editingPost}
                isOpen={!!editingPost}
                onClose={() => setEditingPost(null)}
                onUpdate={() => {
                  setRefresh("true");
                  setEditingPost(null);
                }} 
              />
          )}
        </div>
      </div>
    </div>
  )
}

export default Profile


// main page --> button --> refresh