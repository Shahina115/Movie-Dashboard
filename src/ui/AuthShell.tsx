import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'

export function AuthShell({
  title,
  subtitle,
  children,
}: {
  title: string
  subtitle: ReactNode
  children: ReactNode
}) {
  return (
    <div className="auth-shell">
      <header className="auth-header">
        <Link to="/" className="brand">
          Movie Dashboard
        </Link>
      </header>
      <main className="auth-main">
        <div className="auth-card">
          <h1 className="auth-title">{title}</h1>
          <div className="auth-subtitle">{subtitle}</div>
          <div className="auth-body">{children}</div>
        </div>
      </main>
    </div>
  )
}

