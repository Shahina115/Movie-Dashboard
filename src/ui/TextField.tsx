import { useId, type InputHTMLAttributes, type ReactNode } from 'react'

type Props = InputHTMLAttributes<HTMLInputElement> & {
  label: string
  hint?: string
  error?: string
  right?: ReactNode
}

export function TextField({ label, hint, error, right, className, ...props }: Props) {
  const inputId = useId()
  const hintId = useId()
  const errorId = useId()

  const describedBy = [hint ? hintId : null, error ? errorId : null]
    .filter(Boolean)
    .join(' ')

  return (
    <label className={['field', className].filter(Boolean).join(' ')}>
      <span className="field-label">{label}</span>
      <span className="field-row">
        <input
          {...props}
          id={inputId}
          aria-invalid={Boolean(error)}
          aria-describedby={describedBy || undefined}
          className="field-input"
        />
        {right ? <span className="field-right">{right}</span> : null}
      </span>
      {hint ? (
        <span id={hintId} className="field-hint">
          {hint}
        </span>
      ) : null}
      {error ? (
        <span id={errorId} className="field-error">
          {error}
        </span>
      ) : null}
    </label>
  )
}

