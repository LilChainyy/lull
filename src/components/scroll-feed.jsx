import { useMemo } from 'react'
import videos from '../data/videos.json'
import { VideoCard } from './video-card'

export function ScrollFeed({ category, isFavorite, onToggleFavorite, isMuted, onToggleMute }) {
  const filtered = useMemo(
    () => category === 'all' ? videos : videos.filter((v) => v.category === category),
    [category],
  )

  return (
    <div
      key={category}
      className="h-screen-safe w-screen overflow-y-scroll snap-y snap-mandatory scrollbar-hide scroll-touch animate-feed-enter overscroll-none touch-pan-y"
    >
      {filtered.map((video, i) => (
        <VideoCard
          key={video.id}
          video={video}
          isFavorite={isFavorite(video.id)}
          onToggleFavorite={onToggleFavorite}
          isFirst={i === 0}
          isMuted={isMuted}
          onToggleMute={onToggleMute}
        />
      ))}
    </div>
  )
}
