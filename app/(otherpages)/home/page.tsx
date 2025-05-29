'use client'
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Stories from '@/components/Stories'
import Posts from '@/components/Posts'

interface Story {
  user_id: string
  user_name: string
  story_url: string
}

interface Comment {
  user_name: string
  user_id: string
  comment: string
}

interface Post {
  post_id: string
  user_id: string
  user_name: string
  profile_pic: string
  post_details: {
    image_url: string
    caption: string
  }
  likes_count: number
  comments: Comment[]
  created_at: string
}

const Home = () => {
  const [stories, setStories] = useState<Story[]>([])
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [storiesResponse, postsResponse] = await Promise.all([
          axios.get('/api/stories'),
          axios.get('/api/posts')
        ])
        setStories(storiesResponse.data)
        setPosts(postsResponse.data)
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* Stories Section */}
      <div className="mb-8">
        <Stories stories={stories} />
      </div>

      {/* Posts Section */}
      <div className="space-y-6">
        {posts.map((post) => (
          <Posts key={post.post_id} post={post} />
        ))}
      </div>
    </div>
  )
}

export default Home