'use client'
import React from 'react'
import Image from 'next/image'

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

interface PostsProps {
  post: Post
}

const Posts = ({ post }: PostsProps) => {
  return (
    <div className="bg-white rounded-lg shadow mb-6">
      {/* Post Header */}
      <div className="flex items-center p-3">
        <div className="flex items-center flex-grow">
          <div className="w-8 h-8 rounded-full overflow-hidden mr-3">
            <Image
              src={post.profile_pic}
              alt={post.user_name}
              width={32}
              height={32}
              className="w-full h-full object-cover"
            />
          </div>
          <span className="font-semibold text-sm">{post.user_name}</span>
        </div>
        <button className="text-gray-500">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M6 10c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm12 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm-6 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
          </svg>
        </button>
      </div>

      {/* Post Image */}
      <div className="relative">
        <Image
          src={post.post_details.image_url}
          alt={post.post_details.caption}
          width={600}
          height={600}
          className="w-full"
        />
      </div>

      {/* Post Actions */}
      <div className="p-3">
        <div className="flex items-center space-x-4 mb-2">
          <div className="flex items-center space-x-4">
            <button className="flex items-center">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </button>
            <button>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </button>
          </div>
        </div>
        <span className="font-semibold text-sm">{post.likes_count} likes</span>
        <p className="text-sm mt-1">
          <span className="font-semibold">{post.user_name}</span>{' '}
          {post.post_details.caption}
        </p>
        {post.comments.length > 0 && (
          <div className="mt-2">
            {post.comments.map((comment, index) => (
              <p key={index} className="text-sm">
                <span className="font-semibold">{comment.user_name}</span>{' '}
                {comment.comment}
              </p>
            ))}
          </div>
        )}
        <p className="text-xs text-gray-400 mt-2 uppercase">{post.created_at}</p>
      </div>
    </div>
  )
}

export default Posts