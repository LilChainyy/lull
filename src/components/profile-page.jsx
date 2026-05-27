import { useState, useEffect } from 'react'
import { useAuth } from '../hooks/use-auth'
import { useFavorites } from '../hooks/use-favorites'
import { supabase } from '../utils/supabase'
import videos from '../data/videos.json'
import { usePostHog } from '@posthog/react'

export function ProfilePage({ onClose }) {
  const { user, signOut } = useAuth()
  const { favorites } = useFavorites()
  const [profile, setProfile] = useState(null)
  const posthog = usePostHog()

  useEffect(() => {
    if (!supabase || !user) return

    supabase
      .from('profiles')
      .select('display_name, avatar_url')
      .eq('id', user.id)
      .single()
      .then(({ data }) => {
        if (data) setProfile(data)
      })
  }, [user])

  const displayName =
    profile?.display_name ||
    user?.user_metadata?.full_name ||
    user?.email ||
    'User'

  const avatarUrl =
    profile?.avatar_url || user?.user_metadata?.avatar_url

  const saved = videos.filter((v) => favorites.has(v.id))

  const handleSignOut = async () => {
    posthog?.capture('sign_out', { favorite_count: favorites.size })
    await signOut()
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-black/95 backdrop-blur-lg">
      <div
        className="flex items-center justify-between px-5 pb-3"
        style={{ paddingTop: 'calc(1.25rem + env(safe-area-inset-top))' }}
      >
        <h2 className="text-white text-lg font-medium">Profile</h2>
        <button
          onClick={onClose}
          className="flex items-center justify-center min-w-[44px] min-h-[44px] text-white/60 text-sm active:text-white transition-colors"
        >
          Close
        </button>
      </div>

      <div
        className="flex-1 overflow-y-auto scrollbar-hide px-5 overscroll-none"
        style={{ paddingBottom: 'calc(2rem + env(safe-area-inset-bottom))' }}
      >
        {/* Avatar + name */}
        <div className="flex flex-col items-center gap-3 pt-4 pb-6">
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt={displayName}
              className="w-16 h-16 rounded-full object-cover"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center">
              <span className="text-white text-xl font-medium">
                {displayName.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
          <p className="text-white text-base font-medium">{displayName}</p>
          <p className="text-white/40 text-xs">{saved.length} saved videos</p>
        </div>

        {/* Favorites grid */}
        {saved.length > 0 && (
          <div className="grid grid-cols-2 gap-2 pb-6">
            {saved.map((video) => (
              <div
                key={video.id}
                className="relative aspect-video rounded-lg overflow-hidden"
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
              </div>
            ))}
          </div>
        )}

        {/* Sign out */}
        <button
          onClick={handleSignOut}
          className="w-full py-3 rounded-lg bg-white/10 text-white/70 text-sm font-medium active:bg-white/20 transition-colors"
        >
          Sign Out
        </button>
      </div>
    </div>
  )
}
