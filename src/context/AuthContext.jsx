import { createContext, useContext, useEffect, useState } from 'react'
import {
  getSession,
  signUp as authSignUp,
  signIn as authSignIn,
  signOut as authSignOut,
  updatePassword as authUpdatePassword,
} from '../lib/localAuth'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser]     = useState(null)
  const [loading, setLoading] = useState(true)

  // Restore session from localStorage on mount
  useEffect(() => {
    const session = getSession()
    if (session) {
      setUser({ id: session.userId, email: session.email })
    }
    setLoading(false)
  }, [])

  async function signUp(email, password) {
    const { user: u, session } = await authSignUp(email, password)
    setUser({ id: u.id, email: u.email })
    return { session }
  }

  async function signIn(email, password) {
    const { user: u } = await authSignIn(email, password)
    setUser({ id: u.id, email: u.email })
  }

  async function signOut() {
    authSignOut()
    setUser(null)
  }

  // Forgot-password is not applicable for local auth — no email system.
  async function resetPassword(_email) {
    throw new Error('Password reset by email is not available in offline mode. Use Settings to change your password after signing in.')
  }

  async function updatePassword(newPassword) {
    if (!user) throw new Error('Not signed in.')
    await authUpdatePassword(user.id, newPassword)
  }

  return (
    <AuthContext.Provider value={{ user, loading, signUp, signIn, signOut, resetPassword, updatePassword }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
