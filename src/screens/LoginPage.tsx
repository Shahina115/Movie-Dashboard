import { useMemo, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../state/AuthContext'
import { AuthShell } from '../ui/AuthShell'
import { Button } from '../ui/Button'
import { TextField } from '../ui/TextField'

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}

export function LoginPage() {
  const { login, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [formError, setFormError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const nextPath = useMemo(() => {
    const raw = searchParams.get('next')
    return raw ? decodeURIComponent(raw) : '/dashboard'
  }, [searchParams])

  if (isAuthenticated) {
    navigate('/dashboard', { replace: true })
  }

  const emailError = !email.trim()
    ? 'Email is required'
    : !isValidEmail(email.trim())
      ? 'Enter a valid email'
      : undefined

  const passwordError = !password ? 'Password is required' : undefined

  const isInvalid = Boolean(emailError || passwordError)

  return (
    <AuthShell
      title="Welcome back"
      subtitle={
        <span>
          Don&apos;t have an account? <Link to="/signup">Sign up</Link>
        </span>
      }
    >
      <form
        className="stack"
        onSubmit={(e) => {
          e.preventDefault()
          setFormError(null)
          if (isInvalid) return

          setIsSubmitting(true)
          try {
            login({ email, password })
            navigate(nextPath, { replace: true })
          } catch (err) {
            const message = err instanceof Error ? err.message : 'Login failed'
            setFormError(message)
          } finally {
            setIsSubmitting(false)
          }
        }}
      >
        {formError ? <div className="alert alert-error">{formError}</div> : null}
        <TextField
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
          placeholder="you@company.com"
          error={email ? emailError : undefined}
        />
        <TextField
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
          placeholder="Your password"
          error={password ? passwordError : undefined}
        />
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Logging in…' : 'Login'}
        </Button>
      </form>
    </AuthShell>
  )
}

