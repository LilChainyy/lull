import { useRef, useEffect, useState } from 'react'
import { loadYouTubeAPI } from '../utils/youtube-api'

// YT error codes → user-friendly messages
const ERROR_MESSAGES = {
  2: 'This video is unavailable',
  5: 'This video can\u2019t be played right now',
  100: 'This video was removed or is private',
  101: 'This video can\u2019t be embedded',
  150: 'This video can\u2019t be embedded',
}

const STALL_TIMEOUT = 15000
const DEFAULT_VOLUME = 40

export function useYouTubePlayer(playerDivId, youtubeId, isVisible, isMuted) {
  const playerRef = useRef(null)
  const [ready, setReady] = useState(false)
  const [error, setError] = useState(null)

  // Initialize the YT player once
  useEffect(() => {
    let destroyed = false
    let stallTimer = null

    // Start a stall timer — if onReady never fires, show fallback
    stallTimer = setTimeout(() => {
      if (!destroyed && !ready) {
        setError('Taking too long to load — try scrolling past')
      }
    }, STALL_TIMEOUT)

    loadYouTubeAPI()
      .then(() => {
        if (destroyed) return

        playerRef.current = new window.YT.Player(playerDivId, {
          videoId: youtubeId,
          playerVars: {
            autoplay: 0,
            mute: 1,
            controls: 0,
            loop: 1,
            playlist: youtubeId,
            playsinline: 1,
            modestbranding: 1,
            rel: 0,
            showinfo: 0,
            iv_load_policy: 3,
            disablekb: 1,
            fs: 0,
          },
          events: {
            onReady: (e) => {
              if (!destroyed) {
                clearTimeout(stallTimer)
                e.target.setVolume(DEFAULT_VOLUME)
                setReady(true)
              }
            },
            onError: (e) => {
              if (!destroyed) {
                clearTimeout(stallTimer)
                const msg = ERROR_MESSAGES[e.data] || 'This video couldn\u2019t be loaded'
                setError(msg)
              }
            },
          },
        })
      })
      .catch(() => {
        if (!destroyed) {
          clearTimeout(stallTimer)
          setError('Couldn\u2019t connect to YouTube')
        }
      })

    return () => {
      destroyed = true
      clearTimeout(stallTimer)
      if (playerRef.current?.destroy) {
        playerRef.current.destroy()
        playerRef.current = null
      }
    }
  }, [youtubeId, playerDivId]) // eslint-disable-line react-hooks/exhaustive-deps

  // Play/pause based on visibility
  useEffect(() => {
    const player = playerRef.current
    if (!ready || !player || error) return

    try {
      if (isVisible) {
        player.playVideo()
      } else {
        player.pauseVideo()
      }
    } catch {
      // Player not ready yet — safe to ignore
    }
  }, [isVisible, ready, error])

  // Sync mute state from prop to YT player
  useEffect(() => {
    const player = playerRef.current
    if (!ready || !player || error) return

    try {
      if (isMuted) {
        player.mute()
      } else {
        player.unMute()
        player.setVolume(DEFAULT_VOLUME)
      }
    } catch {
      // Ignore if player not ready
    }
  }, [isMuted, ready, error])

  return { ready, error }
}
