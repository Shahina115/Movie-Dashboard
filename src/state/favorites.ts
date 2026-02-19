import { createContext } from 'react'
import { getMovieId, type Movie } from '../lib/movie'

export type FavoritesContextValue = {
  favorites: Movie[]
  isFavorite: (movieOrId: Movie | string) => boolean
  toggleFavorite: (movie: Movie) => void
  removeFavorite: (movieOrId: Movie | string) => void
  clearFavorites: () => void
}

export const FavoritesContext = createContext<FavoritesContextValue | null>(null)

export const FAVORITES_KEY = 'movieDashboard_favorites'

export function safeParseJson<T>(value: string | null): T | null {
  if (!value) return null
  try {
    return JSON.parse(value) as T
  } catch {
    return null
  }
}

export function getFavoriteId(value: Movie | string) {
  return typeof value === 'string' ? value : getMovieId(value)
}

