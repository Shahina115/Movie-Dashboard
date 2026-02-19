import { Button } from './Button'

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value))
}

function range(start: number, end: number) {
  const out: number[] = []
  for (let i = start; i <= end; i += 1) out.push(i)
  return out
}

export function Pagination({
  currentPage,
  totalPages,
  onChange,
}: {
  currentPage: number
  totalPages: number
  onChange: (page: number) => void
}) {
  const safeTotal = Math.max(1, totalPages)
  const safeCurrent = clamp(currentPage, 1, safeTotal)

  const windowSize = 5
  const half = Math.floor(windowSize / 2)
  const start = clamp(safeCurrent - half, 1, Math.max(1, safeTotal - windowSize + 1))
  const end = clamp(start + windowSize - 1, 1, safeTotal)

  const pages = range(start, end)

  return (
    <div className="pagination">
      <Button
        type="button"
        variant="ghost"
        disabled={safeCurrent <= 1}
        onClick={() => onChange(safeCurrent - 1)}
      >
        Previous
      </Button>
      <div className="pagination-pages">
        {start > 1 ? (
          <>
            <button type="button" className="page" onClick={() => onChange(1)}>
              1
            </button>
            <span className="page-ellipsis">…</span>
          </>
        ) : null}
        {pages.map((p) => (
          <button
            key={p}
            type="button"
            className={['page', p === safeCurrent ? 'page-active' : ''].filter(Boolean).join(' ')}
            onClick={() => onChange(p)}
          >
            {p}
          </button>
        ))}
        {end < safeTotal ? (
          <>
            <span className="page-ellipsis">…</span>
            <button type="button" className="page" onClick={() => onChange(safeTotal)}>
              {safeTotal}
            </button>
          </>
        ) : null}
      </div>
      <Button
        type="button"
        variant="ghost"
        disabled={safeCurrent >= safeTotal}
        onClick={() => onChange(safeCurrent + 1)}
      >
        Next
      </Button>
    </div>
  )
}

