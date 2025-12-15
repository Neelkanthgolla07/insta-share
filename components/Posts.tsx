'use client'
import React from 'react'
import Image from 'next/image'
import { useState } from 'react'
import { useSession } from 'next-auth/react'
import mongoose from 'mongoose';

declare module "next-auth" {
  interface User {
    id?: string;
    name?: string | null;
  }
  interface Session {
    user?: User;
  }
}
interface Post {
  _id: string;
  user_id: mongoose.Types.ObjectId;
  user_name: string;
  profile_pic?: string;
  post_details: {
    image_url: string;
    caption?: string;
  };
  likes: string[] 
  comments: Comment[];
  created_at: string | Date;
}

interface Comment {
  user_id: mongoose.Types.ObjectId;
  user_name: string;
  comment: string;
  created_at: string | Date;
}

const Posts = ({ post }: { post: Post }) => {
  const { data: session } = useSession()
  const [likes, setLikes] = useState<string[]>(post.likes) 
  const [comments, setComments] = useState<Comment[]>(post.comments)
  const [newComment, setNewComment] = useState('')
  const [isLiking, setIsLiking] = useState(false)
  const [isCommenting, setIsCommenting] = useState(false)

  // Add isLiked check
   const isLiked = session?.user?.name ? likes.includes(session?.user?.name) : false
    // console.log(session?.user?.name) 
   
  const handleLike = async () => {
     console.log('isLiked:', isLiked,  'likes:', likes)
    if (!session?.user || isLiking) {
      console.log("User not logged in or already liking")
      return
    }
    setIsLiking(true)

    try {
      const res = await fetch(`/api/posts/${post._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        

      })

      if (res.ok) {
        const data = await res.json()
        setLikes(data.likes)
      }
    } catch (error) {
      console.error('Error liking post:', error)
    } finally {
      setIsLiking(false)
    }
  }

  const handleComment = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!session?.user?.name || !newComment.trim() || isCommenting) return

    setIsCommenting(true)
    try {
      const res = await fetch(`/api/posts/${post._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          comment: newComment,
          user_name: session.user.name
        })
      })

      if (res.ok) {
        const data = await res.json()
        setComments([...comments, data.comment])
        setNewComment('')
      }
    } catch (error) {
      console.error('Error adding comment:', error)
    } finally {
      setIsCommenting(false)
    }
  }

  // Rest of your JSX remains the same, but with proper type checking
  return (
    <div className="bg-white rounded-lg shadow mb-6">
      {/* Post Header */}
      <div className="flex items-center p-3">
        <div className="flex items-center flex-grow">
          <Image
            src={post.profile_pic || "/avatar.png"}
            alt={post.user_name}
            width={32}
            height={32}
            className="rounded-full mr-3"
          />
          <span className="font-semibold">{post.user_name}</span>
        </div>
      </div>

      {/* Post Image */}
      <div className="relative aspect-square">
        <Image
          src={post.post_details.image_url}
          alt="Post image"
          fill
          className="object-cover"
        />
      </div>

      {/* Post Actions */}
      <div className="p-4">
        <div className="flex items-center space-x-4">
          <button 
            onClick={handleLike}
            disabled={isLiking || !session}
            className={`${isLiked ? 'text-red-500' : 'text-black'} transition-colors`}
          >
            {isLiked ? (
    // Filled heart for liked state
    <svg 
      className="w-6 h-6 text-red-500" 
      fill="currentColor" 
      viewBox="0 0 24 24"
    >
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
    </svg>
  ) : (
    // Outlined heart for non-liked state
    <svg 
      className="w-6 h-6 text-black" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      viewBox="0 0 24 24"
    >
      <path 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
      />
    </svg>
  )}
          </button>
        </div>

        <div className="mt-2">
          <p className="font-semibold">{likes.length} likes</p>
          <p className="mt-1">
            <span className="font-semibold mr-2">{post.user_name}</span>
            {post.post_details.caption}
          </p>
        </div>

        {/* Comments */}
        <div className="mt-4 space-y-2">
          {comments.map((comment, index) => (
            <div key={`comment-${index}-${comment.created_at}`} className="text-sm">
              <span className="font-semibold mr-2">{comment.user_name}</span>
              {comment.comment}
            </div>
          ))}
        </div>

        {/* Add Comment */}
        {session && (
          <form onSubmit={handleComment} className="mt-4 flex">
            <input
              type="text"
              placeholder="Add a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="flex-1 border-gray-300 focus:ring-blue-500 focus:border-blue-500 block w-full text-sm rounded-md"
            />
            <button
              type="submit"
              disabled={isCommenting || !newComment.trim()}
              className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-md disabled:opacity-50"
            >
              Post
            </button>
          </form>
        )}
      </div>
    </div>
  )
}

export default Posts