import { useRef, useState, useCallback, useEffect } from 'react'
import { useOnScreen } from '../hooks/use-on-screen'
import { useYouTubePlayer } from '../hooks/use-youtube-player'
import { trackEvent, trackVideoView } from '../utils/analytics'

const CATEGORY_LABELS = {
  ambient: 'Ambient',
  wisdom: 'Wisdom',
  guided: 'Guided',
  satisfying: 'Satisfying',
  filmcamera: 'Film Camera',
  surfing: 'Surfing',
}

const UNMUTE_HINT_KEY = 'calm-scroll-unmute-hint-dismissed'

export function VideoCard({ video, isFavorite, onToggleFavorite, isFirst, isMuted, onToggleMute }) {
  const cardRef = useRef(null)
  const playerDivId = `yt-player-${video.id}`
  const isVisible = useOnScreen(cardRef)
  const { ready, error } = useYouTubePlayer(playerDivId, video.youtubeId, isVisible, isMuted)
  const [heartPop, setHeartPop] = useState(false)
  const [showHint, setShowHint] = useState(
    () => isFirst && !localStorage.getItem(UNMUTE_HINT_KEY),
  )

  const thumbnailUrl = `https://img.youtube.com/vi/${video.youtubeId}/hqdefault.jpg`
  const viewTracked = useRef(false)

  // Track video_view after 2 seconds of continuous visibility
  useEffect(() => {
    if (!isVisible || viewTracked.current) return

    const timer = setTimeout(() => {
      viewTracked.current = true
      trackVideoView(video.id)
      trackEvent('video_view', { video: video.id, category: video.category })
    }, 2000)

    return () => clearTimeout(timer)
  }, [isVisible, video.id, video.category])

  const handleToggleMute = useCallback(() => {
    if (isMuted) {
      trackEvent('unmute', { video: video.id })
    }
    onToggleMute()

    if (showHint) {
      setShowHint(false)
      localStorage.setItem(UNMUTE_HINT_KEY, '1')
    }
  }, [onToggleMute, showHint, isMuted, video.id])

  const handleFavorite = useCallback(() => {
    trackEvent('favorite_toggle', { video: video.id, action: isFavorite ? 'remove' : 'add' })
    onToggleFavorite(video.id)
    setHeartPop(true)
    setTimeout(() => setHeartPop(false), 300)
  }, [video.id, onToggleFavorite, isFavorite])

  return (
    <section
      ref={cardRef}
      className="relative h-screen-safe w-full snap-start overflow-hidden bg-black"
    >
      {/* Thumbnail — always present as background, shown while loading or on error */}
      <div
        className={`absolute inset-0 bg-cover bg-center transition-opacity duration-700 ease-out ${
          ready && !error ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}
      >
        <div
          className={`absolute inset-0 blur-sm scale-105 bg-cover bg-center ${
            error ? '' : 'animate-thumb-pulse'
          }`}
          style={{ backgroundImage: `url(${thumbnailUrl})` }}
        />
        <div className={`absolute inset-0 ${error ? 'bg-black/60' : 'bg-black/30'}`} />
      </div>

      {/* Error fallback — calm message over the dimmed thumbnail */}
      {error && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center px-10 pointer-events-none animate-feed-enter">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="w-10 h-10 text-white/30 mb-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z" />
          </svg>
          <p className="text-white/50 text-sm text-center leading-relaxed">{error}</p>
        </div>
      )}

      {/* YT player container — hidden when error */}
      {!error && (
        <div
          className={`absolute inset-0 flex items-center justify-center pointer-events-none transition-opacity duration-700 ease-out ${
            ready ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <div id={playerDivId} className="absolute w-[300%] h-[300%]" />
        </div>
      )}

      {/* Player div must exist in DOM for YT API even during error — render hidden if error */}
      {error && <div id={playerDivId} className="hidden" />}

      {/* Right sidebar buttons — hidden when error */}
      {!error && (
        <div className="absolute right-[calc(1rem+env(safe-area-inset-right))] bottom-32 z-10 flex flex-col items-center gap-5">
          {/* Mute/unmute */}
          <div className="relative">
            <button
              onClick={handleToggleMute}
              className="flex items-center justify-center w-11 h-11 rounded-full bg-black/40 backdrop-blur-sm active:scale-90 transition-transform"
              aria-label={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted ? (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5 text-white/80">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707A1 1 0 0112 5v14a1 1 0 01-1.707.707L5.586 15z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5 text-white/80">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707A1 1 0 0112 5v14a1 1 0 01-1.707.707L5.586 15z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.536 8.464a5 5 0 010 7.072M18.364 5.636a9 9 0 010 12.728" />
                </svg>
              )}
            </button>

            {/* "Tap to unmute" hint — first visit only */}
            {showHint && (
              <div className="absolute right-14 top-1/2 -translate-y-1/2 animate-hint-pulse whitespace-nowrap pointer-events-none">
                <span className="px-3 py-1.5 rounded-full bg-white/90 text-black text-xs font-medium shadow-lg">
                  Tap to unmute
                </span>
              </div>
            )}
          </div>

          {/* Favorite/heart */}
          <button
            onClick={handleFavorite}
            className={`flex items-center justify-center w-11 h-11 rounded-full bg-black/40 backdrop-blur-sm transition-transform duration-200 ${
              heartPop ? 'scale-125' : 'scale-100 active:scale-90'
            }`}
            aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            {isFavorite ? (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-red-500">
                <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5 text-white/80">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
              </svg>
            )}
          </button>
        </div>
      )}

      {/* Bottom gradient overlay */}
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/70 to-transparent pointer-events-none" />

      {/* Title + category */}
      <div
        className="absolute inset-x-0 bottom-0 p-5 pr-20 pointer-events-none"
        style={{ paddingBottom: 'calc(2rem + env(safe-area-inset-bottom))' }}
      >
        <span className="inline-block px-2 py-0.5 mb-2 text-xs font-medium uppercase tracking-wider text-white/80 bg-white/10 rounded-full backdrop-blur-sm">
          {CATEGORY_LABELS[video.category] ?? video.category}
        </span>
        <h2 className="text-white text-lg font-medium leading-snug">
          {video.title}
        </h2>
        <p className="text-white/50 text-sm mt-0.5">{video.creator}</p>
      </div>
    </section>
  )
}
