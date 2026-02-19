import { useContext } from 'react'
import { FavoritesContext } from './favorites'

export function useFavorites() {
  const value = useContext(FavoritesContext)
  if (!value) throw new Error('useFavorites must be used within a FavoritesProvider')
  return value
}

