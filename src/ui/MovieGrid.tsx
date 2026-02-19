import type { Movie } from '../lib/movie'
import { getMovieId } from '../lib/movie'
import { MovieCard } from './MovieCard'

export function MovieGrid({
  movies,
  isFavorite,
  onToggleFavorite,
  onOpenDetails,
}: {
  movies: Movie[]
  isFavorite: (movie: Movie) => boolean
  onToggleFavorite: (movie: Movie) => void
  onOpenDetails: (movie: Movie) => void
}) {
  return (
    <div className="movie-grid">
      {movies.map((movie, idx) => (
        <MovieCard
          key={getMovieId(movie) || String(idx)}
          movie={movie}
          isFavorite={isFavorite(movie)}
          onToggleFavorite={onToggleFavorite}
          onOpenDetails={onOpenDetails}
        />
      ))}
    </div>
  )
}
