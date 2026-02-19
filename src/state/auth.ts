import { createContext } from 'react'

export type RegisteredUser = {
  name: string
  email: string
  password: string
}

export type AuthUser = {
  name: string
  email: string
}

export type AuthContextValue = {
  user: AuthUser | null
  isAuthenticated: boolean
  signup: (input: RegisteredUser) => void
  login: (input: Pick<RegisteredUser, 'email' | 'password'>) => void
  logout: () => void
}

export const AuthContext = createContext<AuthContextValue | null>(null)

export const REGISTERED_USER_KEY = 'movieDashboard_registeredUser'
export const SESSION_USER_KEY = 'movieDashboard_sessionUser'

export function safeParseJson<T>(value: string | null): T | null {
  if (!value) return null
  try {
    return JSON.parse(value) as T
  } catch {
    return null
  }
}

export function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}

