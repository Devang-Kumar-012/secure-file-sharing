import { createContext, useContext, useEffect, useRef, useState } from 'react'
import { supabase, supabaseReady } from '../lib/supabase'
import {
  getSession    as localGetSession,
  signUp        as localSignUp,
  signIn        as localSignIn,
  signOut       as localSignOut,
  updatePassword as localUpdatePassword,
} from '../lib/localAuth'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null)
  const [loading, setLoading] = useState(true)
  const initialized           = useRef(false)

  useEffect(() => {
    if (supabaseReady) {
      // ── Supabase auth ──────────────────────────────────────────────
      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        setUser(session?.user ?? null)
        if (!initialized.current) {
          initialized.current = true
          setLoading(false)
        }
      })
      // Safety timeout in case onAuthStateChange never fires
      const t = setTimeout(() => {
        if (!initialized.current) { initialized.current = true; setLoading(false) }
      }, 3000)
      return () => { subscription.unsubscribe(); clearTimeout(t) }
    } else {
      // ── Local auth fallback ────────────────────────────────────────
      const session = localGetSession()
      if (session) setUser({ id: session.userId, email: session.email })
      setLoading(false)
    }
  }, [])

  // ── signUp ─────────────────────────────────────────────────────────────────
  async function signUp(email, password) {
    if (supabaseReady) {
      const { data, error } = await supabase.auth.signUp({ email, password })
      if (error) throw error
      // data.session is null when email confirmation is required
      return { session: data.session, user: data.user }
    } else {
      return localSignUp(email, password)
    }
  }

  // ── signIn ─────────────────────────────────────────────────────────────────
  async function signIn(email, password) {
    if (supabaseReady) {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) throw error
      return data
    } else {
      const result = await localSignIn(email, password)
      setUser({ id: result.user.id, email: result.user.email })
      return result
    }
  }

  // ── signOut ────────────────────────────────────────────────────────────────
  async function signOut() {
    if (supabaseReady) {
      await supabase.auth.signOut()
    } else {
      localSignOut()
      setUser(null)
    }
  }

  // ── resetPassword ──────────────────────────────────────────────────────────
  async function resetPassword(email) {
    if (supabaseReady) {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      })
      if (error) throw error
    } else {
      throw new Error('Password reset by email requires Supabase to be configured. Sign in and use Settings to change your password.')
    }
  }

  // ── updatePassword ─────────────────────────────────────────────────────────
  async function updatePassword(newPassword) {
    if (supabaseReady) {
      const { error } = await supabase.auth.updateUser({ password: newPassword })
      if (error) throw error
    } else {
      if (!user) throw new Error('Not signed in.')
      await localUpdatePassword(user.id, newPassword)
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, supabaseReady, signUp, signIn, signOut, resetPassword, updatePassword }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
