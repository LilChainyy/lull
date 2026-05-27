export function trackEvent(name, props) {
  if (typeof window === 'undefined' || !window.plausible) return
  window.plausible(name, { props })
}

// Track unique video views for session_depth
const viewedVideos = new Set()

export function trackVideoView(videoId) {
  viewedVideos.add(videoId)
}

export function getSessionDepth() {
  return viewedVideos.size
}

// Flush session depth on page unload
if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', () => {
    const depth = getSessionDepth()
    if (depth > 0) {
      trackEvent('session_depth', { depth })
    }
  })
}
