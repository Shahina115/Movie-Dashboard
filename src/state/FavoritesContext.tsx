import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { getMovieId, type Movie } from '../lib/movie'

type FavoritesContextValue = {
  favorites: Movie[]
  isFavorite: (movieOrId: Movie | string) => boolean
  toggleFavorite: (movie: Movie) => void
  removeFavorite: (movieOrId: Movie | string) => void
  clearFavorites: () => void
}

const FavoritesContext = createContext<FavoritesContextValue | null>(null)

const FAVORITES_KEY = 'movieDashboard_favorites'

function safeParseJson<T>(value: string | null): T | null {
  if (!value) return null
  try {
    return JSON.parse(value) as T
  } catch {
    return null
  }
}

function getId(value: Movie | string) {
  return typeof value === 'string' ? value : getMovieId(value)
}

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<Movie[]>([])

  useEffect(() => {
    const stored = safeParseJson<Movie[]>(localStorage.getItem(FAVORITES_KEY))
    if (stored && Array.isArray(stored)) setFavorites(stored)
  }, [])

  useEffect(() => {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites))
  }, [favorites])

  const isFavorite = useCallback(
    (movieOrId: Movie | string) => {
      const id = getId(movieOrId)
      if (!id) return false
      return favorites.some((m) => getMovieId(m) === id)
    },
    [favorites],
  )

  const toggleFavorite = useCallback((movie: Movie) => {
    const id = getMovieId(movie)
    if (!id) return

    setFavorites((prev) => {
      const exists = prev.some((m) => getMovieId(m) === id)
      if (exists) return prev.filter((m) => getMovieId(m) !== id)
      return [movie, ...prev]
    })
  }, [])

  const removeFavorite = useCallback((movieOrId: Movie | string) => {
    const id = getId(movieOrId)
    if (!id) return
    setFavorites((prev) => prev.filter((m) => getMovieId(m) !== id))
  }, [])

  const clearFavorites = useCallback(() => {
    setFavorites([])
  }, [])

  const value = useMemo<FavoritesContextValue>(
    () => ({ favorites, isFavorite, toggleFavorite, removeFavorite, clearFavorites }),
    [clearFavorites, favorites, isFavorite, removeFavorite, toggleFavorite],
  )

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>
}

export function useFavorites() {
  const value = useContext(FavoritesContext)
  if (!value) throw new Error('useFavorites must be used within a FavoritesProvider')
  return value
}

