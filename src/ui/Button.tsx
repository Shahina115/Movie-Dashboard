import type { ButtonHTMLAttributes, ReactNode } from 'react'

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger'

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant
  leftIcon?: ReactNode
}

export function Button({ variant = 'primary', leftIcon, className, ...props }: Props) {
  const classes = ['btn', `btn-${variant}`, className].filter(Boolean).join(' ')
  return (
    <button {...props} className={classes}>
      {leftIcon ? <span className="btn-icon">{leftIcon}</span> : null}
      <span className="btn-text">{props.children}</span>
    </button>
  )
}

