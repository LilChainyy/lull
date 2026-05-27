import { useState, useCallback, useEffect, useRef } from 'react'
import { useAuthContext } from '../components/auth-context'
import { supabase } from '../utils/supabase'

const STORAGE_KEY = 'calm-scroll-favorites'

function loadLocalFavorites() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? new Set(JSON.parse(raw)) : new Set()
  } catch {
    return new Set()
  }
}

function saveLocalFavorites(set) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...set]))
}

export function useFavorites() {
  const { user } = useAuthContext()
  const [favorites, setFavorites] = useState(loadLocalFavorites)
  const migratedRef = useRef(false)

  // Fetch from Supabase when user logs in
  useEffect(() => {
    if (!supabase || !user) return

    supabase
      .from('favorites')
      .select('video_id')
      .eq('user_id', user.id)
      .then(({ data }) => {
        if (data) {
          setFavorites(new Set(data.map((r) => r.video_id)))
        }
      })
  }, [user])

  // One-time migration: localStorage → Supabase on first login
  useEffect(() => {
    if (!supabase || !user || migratedRef.current) return
    migratedRef.current = true

    const local = loadLocalFavorites()
    if (local.size === 0) return

    const rows = [...local].map((video_id) => ({
      user_id: user.id,
      video_id,
    }))

    supabase
      .from('favorites')
      .upsert(rows, { onConflict: 'user_id,video_id' })
      .then(() => {
        localStorage.removeItem(STORAGE_KEY)
      })
  }, [user])

  const toggleFavorite = useCallback(
    (id) => {
      setFavorites((prev) => {
        const next = new Set(prev)
        const removing = next.has(id)

        if (removing) {
          next.delete(id)
        } else {
          next.add(id)
        }

        if (supabase && user) {
          if (removing) {
            supabase
              .from('favorites')
              .delete()
              .eq('user_id', user.id)
              .eq('video_id', id)
              .then(() => {})
          } else {
            supabase
              .from('favorites')
              .insert({ user_id: user.id, video_id: id })
              .then(() => {})
          }
        } else {
          saveLocalFavorites(next)
        }

        return next
      })
    },
    [user]
  )

  const isFavorite = useCallback((id) => favorites.has(id), [favorites])

  return { favorites, toggleFavorite, isFavorite }
}
