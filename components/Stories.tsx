import React from 'react'
import Image from 'next/image'

interface Story {
  user_id: string
  user_name: string
  story_url: string
}

interface StoriesProps {
  stories: Story[]
}

const Stories = ({ stories }: StoriesProps) => {
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex overflow-x-auto space-x-4 scrollbar-hide">
        {stories.map((story) => (
          <div
            key={story.user_id}
            className="flex flex-col items-center space-y-1 flex-shrink-0"
          >
            <div className="w-16 h-16 rounded-full ring-2 ring-pink-500 p-1">
              <Image
                src={story.story_url}
                alt={story.user_name}
                width={64}
                height={64}
                className="w-full h-full rounded-full object-cover"
              />
            </div>
            <span className="text-xs text-gray-500 truncate w-16 text-center">
              {story.user_name}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Stories