import { useState, useCallback } from 'react'
import { CategoryBar } from './components/category-bar'
import { ScrollFeed } from './components/scroll-feed'
import { FavoritesTab } from './components/favorites-tab'
import { AuthModal } from './components/auth-modal'
import { ProfilePage } from './components/profile-page'
import { useFavorites } from './hooks/use-favorites'
import { useAuth } from './hooks/use-auth'
import { trackEvent } from './utils/analytics'

export function App() {
  const [category, setCategory] = useState('all')
  const [showFavorites, setShowFavorites] = useState(false)
  const [showAuth, setShowAuth] = useState(false)
  const [showProfile, setShowProfile] = useState(false)
  const [isMuted, setIsMuted] = useState(true)
  const { favorites, toggleFavorite, isFavorite } = useFavorites()
  const { user } = useAuth()

  const handleCategorySelect = useCallback((key) => {
    trackEvent('category_switch', { category: key })
    setCategory(key)
  }, [])

  const handleToggleMute = useCallback(() => {
    setIsMuted((prev) => !prev)
  }, [])

  const handleFavoriteSelect = (videoId) => {
    setShowFavorites(false)
    setCategory('all')
    requestAnimationFrame(() => {
      const el = document.getElementById(`yt-player-${videoId}`)
      el?.closest('section')?.scrollIntoView({ behavior: 'smooth' })
    })
  }

  const handleOpenProfile = () => {
    if (user) {
      setShowProfile(true)
    } else {
      setShowAuth(true)
    }
  }

  return (
    <>
      <CategoryBar
        selected={category}
        onSelect={handleCategorySelect}
        onOpenFavorites={() => setShowFavorites(true)}
        favoriteCount={favorites.size}
        onOpenProfile={handleOpenProfile}
        user={user}
      />
      <ScrollFeed
        category={category}
        isFavorite={isFavorite}
        onToggleFavorite={toggleFavorite}
        isMuted={isMuted}
        onToggleMute={handleToggleMute}
      />
      {showFavorites && (
        <FavoritesTab
          favorites={favorites}
          onSelect={handleFavoriteSelect}
          onClose={() => setShowFavorites(false)}
        />
      )}
      {showAuth && (
        <AuthModal onClose={() => setShowAuth(false)} />
      )}
      {showProfile && (
        <ProfilePage onClose={() => setShowProfile(false)} />
      )}
    </>
  )
}
