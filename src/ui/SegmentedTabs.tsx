type TabOption<T extends string> = {
  value: T
  label: string
}

export function SegmentedTabs<T extends string>({
  value,
  options,
  onChange,
}: {
  value: T
  options: readonly TabOption<T>[]
  onChange: (value: T) => void
}) {
  return (
    <div className="tabs">
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          className={['tab', o.value === value ? 'tab-active' : ''].filter(Boolean).join(' ')}
          onClick={() => onChange(o.value)}
        >
          {o.label}
        </button>
      ))}
    </div>
  )
}

