import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'

type RegisteredUser = {
  name: string
  email: string
  password: string
}

export type AuthUser = {
  name: string
  email: string
}

type AuthContextValue = {
  user: AuthUser | null
  isAuthenticated: boolean
  signup: (input: RegisteredUser) => void
  login: (input: Pick<RegisteredUser, 'email' | 'password'>) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

const REGISTERED_USER_KEY = 'movieDashboard_registeredUser'
const SESSION_USER_KEY = 'movieDashboard_sessionUser'

function safeParseJson<T>(value: string | null): T | null {
  if (!value) return null
  try {
    return JSON.parse(value) as T
  } catch {
    return null
  }
}

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)

  useEffect(() => {
    const session = safeParseJson<AuthUser>(localStorage.getItem(SESSION_USER_KEY))
    if (session) setUser(session)
  }, [])

  const signup = useCallback((input: RegisteredUser) => {
    const name = input.name.trim()
    const email = input.email.trim().toLowerCase()
    const password = input.password

    if (!name) throw new Error('Name is required')
    if (!email) throw new Error('Email is required')
    if (!isValidEmail(email)) throw new Error('Email is invalid')
    if (!password) throw new Error('Password is required')

    const registered: RegisteredUser = { name, email, password }
    localStorage.setItem(REGISTERED_USER_KEY, JSON.stringify(registered))

    const nextUser: AuthUser = { name, email }
    localStorage.setItem(SESSION_USER_KEY, JSON.stringify(nextUser))
    setUser(nextUser)
  }, [])

  const login = useCallback((input: Pick<RegisteredUser, 'email' | 'password'>) => {
    const email = input.email.trim().toLowerCase()
    const password = input.password

    if (!email) throw new Error('Email is required')
    if (!isValidEmail(email)) throw new Error('Email is invalid')
    if (!password) throw new Error('Password is required')

    const registered = safeParseJson<RegisteredUser>(
      localStorage.getItem(REGISTERED_USER_KEY),
    )
    if (!registered) {
      throw new Error('No account found. Please sign up first.')
    }
    if (registered.email !== email || registered.password !== password) {
      throw new Error('Invalid email or password')
    }

    const nextUser: AuthUser = { name: registered.name, email: registered.email }
    localStorage.setItem(SESSION_USER_KEY, JSON.stringify(nextUser))
    setUser(nextUser)
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem(SESSION_USER_KEY)
    setUser(null)
  }, [])

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      signup,
      login,
      logout,
    }),
    [login, logout, signup, user],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const value = useContext(AuthContext)
  if (!value) throw new Error('useAuth must be used within an AuthProvider')
  return value
}

