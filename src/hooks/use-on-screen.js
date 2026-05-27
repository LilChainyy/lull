import { useState, useEffect } from 'react'

export function useOnScreen(ref, threshold = 0.6) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node) return

    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold },
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [ref, threshold])

  return isVisible
}
