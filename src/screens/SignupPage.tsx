import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '../state/AuthContext'
import { AuthShell } from '../ui/AuthShell'
import { Button } from '../ui/Button'
import { TextField } from '../ui/TextField'

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}

export function SignupPage() {
  const { signup, isAuthenticated } = useAuth()
  const navigate = useNavigate()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [formError, setFormError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (isAuthenticated) return <Navigate to="/dashboard" replace />

  const nameError = !name.trim() ? 'Name is required' : undefined

  const emailError = !email.trim()
    ? 'Email is required'
    : !isValidEmail(email.trim())
      ? 'Enter a valid email'
      : undefined

  const passwordError = !password
    ? 'Password is required'
    : password.length < 6
      ? 'Minimum 6 characters'
      : undefined

  const isInvalid = Boolean(nameError || emailError || passwordError)

  return (
    <AuthShell
      title="Create your account"
      subtitle={
        <span>
          Already have an account? <Link to="/login">Login</Link>
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
            signup({ name, email, password })
            navigate('/dashboard', { replace: true })
          } catch (err) {
            const message = err instanceof Error ? err.message : 'Signup failed'
            setFormError(message)
          } finally {
            setIsSubmitting(false)
          }
        }}
      >
        {formError ? <div className="alert alert-error">{formError}</div> : null}
        <TextField
          label="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          autoComplete="name"
          placeholder="Your name"
          error={name ? nameError : undefined}
        />
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
          autoComplete="new-password"
          placeholder="Create a password"
          hint="At least 6 characters"
          error={password ? passwordError : undefined}
        />
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Creating…' : 'Sign up'}
        </Button>
      </form>
    </AuthShell>
  )
}

