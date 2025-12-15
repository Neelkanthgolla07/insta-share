'use client'
import { useState } from 'react'
import Image from 'next/image'

interface CreatePostProps {
  setRefresh: (value: string) => void;
}

const CreatePost = (props: CreatePostProps) => {
  const {setRefresh} = props
  const [image, setImage] = useState('')
  const [caption, setCaption] = useState('')
  const [loading, setLoading] = useState(false)
  const [isValidUrl, setIsValidUrl] = useState(false)
  const [urlError, setUrlError] = useState('')
  

  const validateImageUrl = (url: string) => {
    if (url.startsWith('data:image/')) {
    const isValidBase64 = /^data:image\/(jpeg|jpg|png|gif|webp);base64,/.test(url);
    if (!isValidBase64) {
      setUrlError('Invalid base64 image format');
      return false;
    }
    setUrlError('');
    return true;
  }


    try {
      new URL(url);
      // Optional: Add image extension validation
      const validExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
      const hasValidExtension = validExtensions.some(ext => 
        url.toLowerCase().endsWith(ext)
      );
      
      if (!hasValidExtension) {
        setUrlError('Please enter a valid image URL (jpg, jpeg, png, gif, webp)');
        return false;
      }
      
      setUrlError('');
      return true;
    } catch {
      setUrlError('Please enter a valid URL');
      return false;
    }
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setImage(url);
    if (url.trim()) {
      setIsValidUrl(validateImageUrl(url));
    } else {
      setIsValidUrl(false);
      setUrlError('');
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!image.trim()) return

    setLoading(true)
    try {
      const res = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          image_url: image,
          caption
        })
      })

      if (res.ok) {
        setImage('')
        setCaption('')
        setRefresh("true")

        // You might want to add some success feedback here
      }
    } catch (error) {
      console.error('Error creating post:', error)
      // You might want to add some error feedback here
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-xl font-semibold mb-4">Create New Post</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-2">
            Image URL
          </label>
          <input
            id="image"
            type="text"
            value={image}
            onChange={handleImageChange}
            placeholder="Enter image URL"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
           {urlError && (
            <p className="mt-1 text-sm text-red-500">{urlError}</p>
          )}
        </div>
        
        {image && isValidUrl && (
          <div className="mb-4">
            <div className="relative w-full h-64">
              <Image
                src={image}
                alt="Post preview"
                fill
                className="object-cover rounded-lg"
              />
            </div>
          </div>
        )}

        <div className="mb-4">
          <label htmlFor="caption" className="block text-sm font-medium text-gray-700 mb-2">
            Caption
          </label>
          <textarea
            id="caption"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            placeholder="Write a caption..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={3}
          />
        </div>

        <button
          type="submit"
          disabled={loading || !image.trim()}
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? 'Creating Post...' : 'Create Post'}
        </button>
      </form>
    </div>
  )
}

export default CreatePost
