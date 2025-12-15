'use client'
import { useState } from 'react'
import Image from 'next/image'

interface EditPostProps {
  post: {
    _id: string;
    post_details: {
      image_url: string;
      caption: string;
    };
  };
  isOpen: boolean;
  onClose: () => void;
  onUpdate: () => void;
}

const EditPost = ({ post, isOpen, onClose, onUpdate }: EditPostProps) => {
  const [caption, setCaption] = useState(post.post_details.caption)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await fetch(`/api/posts/${post._id}/edit`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          caption
        })
      })

      if (!res.ok) throw new Error('Failed to update post')

      onUpdate()
      onClose()
    } catch (error) {
      console.error('Error updating post:', error)
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 max-w-lg w-full mx-4">
        <h2 className="text-xl font-semibold mb-4">Edit Post</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <Image
              src={post.post_details.image_url}
              alt="Post image"
              width={300}
              height={300}
              className="rounded-lg object-cover"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Caption
            </label>
            <textarea
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
            />
          </div>
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-gray-400"
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EditPost