import { useCallback } from 'react'
import { useAuthContext } from '../components/auth-context'
import { supabase } from '../utils/supabase'

export function useAuth() {
  const { user, loading } = useAuthContext()

  const signIn = useCallback(async (email, password) => {
    if (!supabase) return { error: { message: 'Auth not configured' } }
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    return { error }
  }, [])

  const signUp = useCallback(async (email, password) => {
    if (!supabase) return { error: { message: 'Auth not configured' } }
    const { error } = await supabase.auth.signUp({ email, password })
    return { error }
  }, [])

  const signOut = useCallback(async () => {
    if (!supabase) return
    await supabase.auth.signOut()
  }, [])

  const signInWithGoogle = useCallback(async () => {
    if (!supabase) return { error: { message: 'Auth not configured' } }
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin },
    })
    return { error }
  }, [])

  return { user, loading, signIn, signUp, signOut, signInWithGoogle }
}
