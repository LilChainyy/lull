let apiReady = false
let apiLoading = false
let apiFailed = false
const waiters = []

const API_LOAD_TIMEOUT = 10000

export function loadYouTubeAPI() {
  if (apiReady) return Promise.resolve()
  if (apiFailed) return Promise.reject(new Error('YouTube API blocked'))
  if (apiLoading) {
    return new Promise((resolve, reject) => waiters.push({ resolve, reject }))
  }

  apiLoading = true

  return new Promise((resolve, reject) => {
    waiters.push({ resolve, reject })

    const timer = setTimeout(() => {
      if (!apiReady) fail(new Error('YouTube API load timeout'))
    }, API_LOAD_TIMEOUT)

    const fail = (err) => {
      clearTimeout(timer)
      apiFailed = true
      apiLoading = false
      waiters.forEach((w) => w.reject(err))
      waiters.length = 0
    }

    const prev = window.onYouTubeIframeAPIReady
    window.onYouTubeIframeAPIReady = () => {
      if (prev) prev()
      clearTimeout(timer)
      apiReady = true
      apiLoading = false
      waiters.forEach((w) => w.resolve())
      waiters.length = 0
    }

    const script = document.createElement('script')
    script.src = 'https://www.youtube.com/iframe_api'
    script.onerror = () => fail(new Error('YouTube API script failed to load'))
    document.head.appendChild(script)
  })
}
