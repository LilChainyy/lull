import videos from '../data/videos.json'
import { usePostHog } from '@posthog/react'

export function FavoritesTab({ favorites, onSelect, onClose }) {
  const posthog = usePostHog()
  const saved = videos.filter((v) => favorites.has(v.id))

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-black/95 backdrop-blur-lg">
      {/* Header */}
      <div
        className="flex items-center justify-between px-5 pb-3"
        style={{ paddingTop: 'calc(1.25rem + env(safe-area-inset-top))' }}
      >
        <h2 className="text-white text-lg font-medium">Saved</h2>
        <button
          onClick={onClose}
          className="flex items-center justify-center min-w-[44px] min-h-[44px] text-white/60 text-sm active:text-white transition-colors"
        >
          Close
        </button>
      </div>

      {/* Grid or empty state */}
      {saved.length === 0 ? (
        <div className="flex-1 flex items-center justify-center px-8">
          <p className="text-white/30 text-center text-sm leading-relaxed">
            No saved videos yet. Tap the heart on any video to save it here.
          </p>
        </div>
      ) : (
        <div
          className="flex-1 overflow-y-auto scrollbar-hide px-3 overscroll-none"
          style={{ paddingBottom: 'calc(2rem + env(safe-area-inset-bottom))' }}
        >
          <div className="grid grid-cols-2 gap-2">
            {saved.map((video) => (
              <button
                key={video.id}
                onClick={() => {
                  posthog?.capture('favorite_selected', { video_id: video.id, category: video.category })
                  onSelect(video.id)
                }}
                className="relative aspect-video rounded-lg overflow-hidden group active:scale-[0.97] transition-transform"
              >
                <img
                  src={`https://img.youtube.com/vi/${video.youtubeId}/mqdefault.jpg`}
                  alt={video.title}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <span className="absolute bottom-2 left-2 right-2 text-white text-xs font-medium leading-tight text-left line-clamp-2">
                  {video.title}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
