/**
 * localStorage-based auth store.
 *
 * Keys:
 *   ss_users        – JSON array of { id, email, passwordHash }
 *   ss_session      – JSON { userId, email } | null
 */

const USERS_KEY   = 'ss_users'
const SESSION_KEY = 'ss_session'

// ── Helpers ──────────────────────────────────────────────────────────────────

function readUsers() {
  try { return JSON.parse(localStorage.getItem(USERS_KEY)) || [] } catch { return [] }
}
function writeUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users))
}

function readSession() {
  try { return JSON.parse(localStorage.getItem(SESSION_KEY)) || null } catch { return null }
}
function writeSession(session) {
  if (session) localStorage.setItem(SESSION_KEY, JSON.stringify(session))
  else localStorage.removeItem(SESSION_KEY)
}

// Very simple hash — not cryptographic, just obscures plain-text passwords in localStorage.
// For a production app you would use bcrypt on a real backend.
async function hashPassword(password) {
  const encoder = new TextEncoder()
  const data = encoder.encode(password + 'ss_salt_v1')
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  return Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('')
}

function generateId() {
  return `user_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`
}

// ── Public API ────────────────────────────────────────────────────────────────

export function getSession() {
  return readSession()
}

export async function signUp(email, password) {
  const users = readUsers()
  const normalised = email.trim().toLowerCase()

  if (users.find(u => u.email === normalised)) {
    throw new Error('An account with this email already exists.')
  }

  const passwordHash = await hashPassword(password)
  const user = { id: generateId(), email: normalised, passwordHash, createdAt: new Date().toISOString() }
  writeUsers([...users, user])

  const session = { userId: user.id, email: user.email }
  writeSession(session)
  return { user: { id: user.id, email: user.email }, session }
}

export async function signIn(email, password) {
  const users = readUsers()
  const normalised = email.trim().toLowerCase()
  const user = users.find(u => u.email === normalised)

  if (!user) throw new Error('No account found with that email.')

  const passwordHash = await hashPassword(password)
  if (passwordHash !== user.passwordHash) throw new Error('Incorrect password.')

  const session = { userId: user.id, email: user.email }
  writeSession(session)
  return { user: { id: user.id, email: user.email }, session }
}

export function signOut() {
  writeSession(null)
}

export async function updatePassword(userId, newPassword) {
  const users = readUsers()
  const idx = users.findIndex(u => u.id === userId)
  if (idx === -1) throw new Error('User not found.')
  users[idx].passwordHash = await hashPassword(newPassword)
  writeUsers(users)
}

export function getUserById(userId) {
  const users = readUsers()
  const u = users.find(u => u.id === userId)
  if (!u) return null
  return { id: u.id, email: u.email, createdAt: u.createdAt }
}
