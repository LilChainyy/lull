import { useState } from 'react'
import { useAuth } from '../hooks/use-auth'
import { usePostHog } from '@posthog/react'

export function AuthModal({ onClose }) {
  const { signIn, signUp, signInWithGoogle } = useAuth()
  const [mode, setMode] = useState('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [checkEmail, setCheckEmail] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const posthog = usePostHog()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setSubmitting(true)

    if (mode === 'signin') {
      const { error: err } = await signIn(email, password)
      setSubmitting(false)
      if (err) {
        setError(err.message)
        posthog?.captureException(new Error(err.message), { method: 'email', event_type: 'sign_in_error' })
      } else {
        posthog?.capture('sign_in', { method: 'email' })
        onClose()
      }
    } else {
      const { error: err } = await signUp(email, password)
      setSubmitting(false)
      if (err) {
        setError(err.message)
        posthog?.captureException(new Error(err.message), { method: 'email', event_type: 'sign_up_error' })
      } else {
        posthog?.capture('sign_up', { method: 'email' })
        setCheckEmail(true)
      }
    }
  }

  const handleGoogle = async () => {
    setError(null)
    posthog?.capture('sign_in_with_google')
    const { error: err } = await signInWithGoogle()
    if (err) setError(err.message)
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-black/95 backdrop-blur-lg">
      <div
        className="flex items-center justify-between px-5 pb-3"
        style={{ paddingTop: 'calc(1.25rem + env(safe-area-inset-top))' }}
      >
        <h2 className="text-white text-lg font-medium">
          {mode === 'signin' ? 'Sign In' : 'Sign Up'}
        </h2>
        <button
          onClick={onClose}
          className="flex items-center justify-center min-w-[44px] min-h-[44px] text-white/60 text-sm active:text-white transition-colors"
        >
          Close
        </button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-8">
        {checkEmail ? (
          <p className="text-white/70 text-center text-sm leading-relaxed">
            Check your email for a confirmation link to complete sign-up.
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="w-full max-w-xs flex flex-col gap-4">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-lg bg-white/10 text-white placeholder-white/40 text-sm outline-none focus:ring-2 focus:ring-white/30"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="w-full px-4 py-3 rounded-lg bg-white/10 text-white placeholder-white/40 text-sm outline-none focus:ring-2 focus:ring-white/30"
            />

            {error && (
              <p className="text-red-400 text-xs text-center">{error}</p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 rounded-lg bg-white text-black text-sm font-medium active:bg-white/90 transition-colors disabled:opacity-50"
            >
              {submitting
                ? 'Loading...'
                : mode === 'signin'
                  ? 'Sign In'
                  : 'Create Account'}
            </button>

            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-white/10" />
              <span className="text-white/30 text-xs">or</span>
              <div className="flex-1 h-px bg-white/10" />
            </div>

            <button
              type="button"
              onClick={handleGoogle}
              className="w-full py-3 rounded-lg bg-white/10 text-white text-sm font-medium active:bg-white/20 transition-colors"
            >
              Continue with Google
            </button>

            <button
              type="button"
              onClick={() => {
                setMode(mode === 'signin' ? 'signup' : 'signin')
                setError(null)
              }}
              className="text-white/40 text-xs text-center active:text-white/60 transition-colors"
            >
              {mode === 'signin'
                ? "Don't have an account? Sign up"
                : 'Already have an account? Sign in'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
