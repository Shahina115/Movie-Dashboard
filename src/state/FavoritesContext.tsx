import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { getMovieId, type Movie } from '../lib/movie'
import {
  FAVORITES_KEY,
  FavoritesContext,
  getFavoriteId,
  safeParseJson,
  type FavoritesContextValue,
} from './favorites'

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<Movie[]>(() => {
    const stored = safeParseJson<Movie[]>(localStorage.getItem(FAVORITES_KEY))
    return stored && Array.isArray(stored) ? stored : []
  })

  useEffect(() => {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites))
  }, [favorites])

  const isFavorite = useCallback(
    (movieOrId: Movie | string) => {
      const id = getFavoriteId(movieOrId)
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
    const id = getFavoriteId(movieOrId)
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
