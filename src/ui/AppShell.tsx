import type { ReactNode } from 'react'

export function AppShell({
  header,
  children,
}: {
  header: ReactNode
  children: ReactNode
}) {
  return (
    <div className="app-shell">
      <div className="app-header">{header}</div>
      <div className="app-body">
        <div className="container">{children}</div>
      </div>
    </div>
  )
}

