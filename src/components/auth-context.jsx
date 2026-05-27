import { createContext, useContext, useState, useEffect } from 'react'
import { supabase } from '../utils/supabase'
import { usePostHog } from '@posthog/react'

const AuthContext = createContext({ user: null, loading: true })

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(!!supabase)
  const posthog = usePostHog()

  useEffect(() => {
    if (!supabase) return

    supabase.auth.getSession().then(({ data: { session } }) => {
      const sessionUser = session?.user ?? null
      setUser(sessionUser)
      setLoading(false)
      if (sessionUser) {
        posthog?.identify(sessionUser.id, { email: sessionUser.email })
      }
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        const sessionUser = session?.user ?? null
        setUser(sessionUser)
        if (sessionUser) {
          posthog?.identify(sessionUser.id, { email: sessionUser.email })
        } else {
          posthog?.reset()
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [posthog])

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuthContext() {
  return useContext(AuthContext)
}
