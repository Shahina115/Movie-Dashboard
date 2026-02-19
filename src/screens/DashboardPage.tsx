import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { fetchMoviesPage } from '../lib/moviesApi'
import {
  getMovieCharacterText,
  getMoviePopularity,
  getMovieTitle,
  matchesMovieSearch,
  type Movie,
} from '../lib/movie'
import { useAuth } from '../state/AuthContext'
import { useFavorites } from '../state/FavoritesContext'
import { AppShell } from '../ui/AppShell'
import { Button } from '../ui/Button'
import { MovieGrid } from '../ui/MovieGrid'
import { Pagination } from '../ui/Pagination'
import { SegmentedTabs } from '../ui/SegmentedTabs'
import { TextField } from '../ui/TextField'

type TabKey = 'movies' | 'favorites'
type SortKey = 'title_asc' | 'title_desc' | 'pop_asc' | 'pop_desc'

type UiState = {
  tab: TabKey
  page: number
  query: string
  sort: SortKey
}

const UI_STATE_KEY = 'movieDashboard_uiState'

function safeParseJson<T>(value: string | null): T | null {
  if (!value) return null
  try {
    return JSON.parse(value) as T
  } catch {
    return null
  }
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value))
}

function compareMaybeString(a: string, b: string) {
  return a.localeCompare(b, undefined, { sensitivity: 'base' })
}

function compareMaybeNumber(a: number | null, b: number | null) {
  if (a === null && b === null) return 0
  if (a === null) return 1
  if (b === null) return -1
  return a - b
}

function sortMovies(movies: Movie[], sort: SortKey) {
  const next = [...movies]
  next.sort((a, b) => {
    if (sort === 'title_asc' || sort === 'title_desc') {
      const diff = compareMaybeString(getMovieTitle(a), getMovieTitle(b))
      return sort === 'title_asc' ? diff : -diff
    }

    const diff = compareMaybeNumber(getMoviePopularity(a), getMoviePopularity(b))
    return sort === 'pop_asc' ? diff : -diff
  })
  return next
}

function getInitialUiState(): UiState {
  const stored = safeParseJson<Partial<UiState>>(localStorage.getItem(UI_STATE_KEY)) ?? {}
  const tab: TabKey = stored.tab === 'favorites' ? 'favorites' : 'movies'
  const page = typeof stored.page === 'number' && stored.page > 0 ? stored.page : 1
  const query = typeof stored.query === 'string' ? stored.query : ''
  const sort: SortKey =
    stored.sort === 'title_desc' ||
    stored.sort === 'pop_asc' ||
    stored.sort === 'pop_desc' ||
    stored.sort === 'title_asc'
      ? stored.sort
      : 'pop_desc'
  return { tab, page, query, sort }
}

function MovieDetailsModal({
  movie,
  onClose,
}: {
  movie: Movie
  onClose: () => void
}) {
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [onClose])

  const title = getMovieTitle(movie)
  const character = getMovieCharacterText(movie)
  const popularity = getMoviePopularity(movie)

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true">
      <button type="button" className="modal-backdrop" onClick={onClose} aria-label="Close" />
      <div className="modal">
        <div className="modal-header">
          <div className="modal-title">{title || 'Movie Details'}</div>
          <Button variant="ghost" type="button" onClick={onClose}>
            Close
          </Button>
        </div>
        <div className="modal-body">
          <div className="modal-meta">
            {typeof popularity === 'number' ? (
              <div className="pill">Popularity: {popularity.toFixed(1)}</div>
            ) : (
              <div className="pill pill-muted">Popularity: N/A</div>
            )}
            {character ? <div className="pill pill-muted">Character: {character}</div> : null}
          </div>
          <pre className="code">{JSON.stringify(movie, null, 2)}</pre>
        </div>
      </div>
    </div>
  )
}

export function DashboardPage() {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const { favorites, isFavorite, toggleFavorite, removeFavorite, clearFavorites } = useFavorites()

  const [tab, setTab] = useState<TabKey>(() => getInitialUiState().tab)
  const [currentPage, setCurrentPage] = useState(() => getInitialUiState().page)
  const [totalPages, setTotalPages] = useState(1)
  const [movies, setMovies] = useState<Movie[]>([])
  const [query, setQuery] = useState(() => getInitialUiState().query)
  const [sort, setSort] = useState<SortKey>(() => getInitialUiState().sort)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null)

  useEffect(() => {
    const state: UiState = { tab, page: currentPage, query, sort }
    localStorage.setItem(UI_STATE_KEY, JSON.stringify(state))
  }, [currentPage, query, sort, tab])

  useEffect(() => {
    const controller = new AbortController()
    setIsLoading(true)
    setError(null)
    fetchMoviesPage(currentPage, controller.signal)
      .then((page) => {
        setMovies(page.data)
        setTotalPages(page.totalPages)
        setCurrentPage((p) => clamp(p, 1, page.totalPages))
      })
      .catch((err) => {
        if (controller.signal.aborted) return
        const message = err instanceof Error ? err.message : 'Failed to fetch movies'
        setError(message)
      })
      .finally(() => {
        if (controller.signal.aborted) return
        setIsLoading(false)
      })

    return () => controller.abort()
  }, [currentPage])

  const visibleMovies = useMemo(() => {
    const filtered = movies.filter((m) => matchesMovieSearch(m, query))
    return sortMovies(filtered, sort)
  }, [movies, query, sort])

  const header = (
    <div className="topbar">
      <div className="topbar-left">
        <div className="brand">Movie Dashboard</div>
        <div className="topbar-sub">Browse • Search • Favorites</div>
      </div>
      <div className="topbar-right">
        <div className="user-pill">{user?.email}</div>
        <Button
          type="button"
          variant="secondary"
          onClick={() => {
            logout()
            navigate('/login', { replace: true })
          }}
        >
          Logout
        </Button>
      </div>
    </div>
  )

  return (
    <AppShell header={header}>
      <div className="panel">
        <div className="panel-header">
          <SegmentedTabs<TabKey>
            value={tab}
            options={[
              { value: 'movies', label: 'Movies' },
              { value: 'favorites', label: `Favorites (${favorites.length})` },
            ]}
            onChange={setTab}
          />
        </div>

        {tab === 'movies' ? (
          <div className="panel-body stack">
            <div className="toolbar">
              <div className="toolbar-left">
                <TextField
                  label="Search (current page)"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Title or character name"
                />
              </div>
              <div className="toolbar-right">
                <label className="field">
                  <span className="field-label">Sort</span>
                  <select
                    className="select"
                    value={sort}
                    onChange={(e) => setSort(e.target.value as SortKey)}
                  >
                    <option value="pop_desc">Popularity: high → low</option>
                    <option value="pop_asc">Popularity: low → high</option>
                    <option value="title_asc">Title: A → Z</option>
                    <option value="title_desc">Title: Z → A</option>
                  </select>
                </label>
              </div>
            </div>

            {error ? (
              <div className="alert alert-error">
                {error === 'Missing VITE_MOVIES_API_URL_TEMPLATE'
                  ? 'Missing API URL. Set VITE_MOVIES_API_URL_TEMPLATE (use {{page}} placeholder).'
                  : error}
              </div>
            ) : null}

            <div className="status-row">
              <div className="muted">
                Page {currentPage} / {totalPages} • Showing {visibleMovies.length} of {movies.length}{' '}
                movies
              </div>
              <div className="status-actions">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => {
                    setQuery('')
                    setSort('pop_desc')
                  }}
                >
                  Reset
                </Button>
              </div>
            </div>

            {isLoading ? <div className="skeleton">Loading movies…</div> : null}

            {!isLoading && !error && visibleMovies.length === 0 ? (
              <div className="empty">No movies found on this page.</div>
            ) : null}

            <MovieGrid
              movies={visibleMovies}
              isFavorite={(m) => isFavorite(m)}
              onToggleFavorite={toggleFavorite}
              onOpenDetails={(m) => setSelectedMovie(m)}
            />

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onChange={(page) => setCurrentPage(page)}
            />
          </div>
        ) : (
          <div className="panel-body stack">
            <div className="favorites-header">
              <div className="muted">Your favorites are saved on this device.</div>
              <div className="favorites-actions">
                <Button
                  type="button"
                  variant="danger"
                  disabled={favorites.length === 0}
                  onClick={() => clearFavorites()}
                >
                  Clear all
                </Button>
              </div>
            </div>
            {favorites.length === 0 ? (
              <div className="empty">No favorites yet. Add some from Movies.</div>
            ) : (
              <MovieGrid
                movies={favorites}
                isFavorite={() => true}
                onToggleFavorite={(m) => removeFavorite(m)}
                onOpenDetails={(m) => setSelectedMovie(m)}
              />
            )}
          </div>
        )}
      </div>

      {selectedMovie ? (
        <MovieDetailsModal movie={selectedMovie} onClose={() => setSelectedMovie(null)} />
      ) : null}
    </AppShell>
  )
}
