import { getMovieCharacterText, getMovieId, getMoviePopularity, getMoviePosterUrl, getMovieSubtitle, getMovieTitle, type Movie } from '../lib/movie'
import { Button } from './Button'

export function MovieCard({
  movie,
  isFavorite,
  onToggleFavorite,
  onOpenDetails,
}: {
  movie: Movie
  isFavorite: boolean
  onToggleFavorite: (movie: Movie) => void
  onOpenDetails: (movie: Movie) => void
}) {
  const title = getMovieTitle(movie)
  const subtitle = getMovieSubtitle(movie)
  const posterUrl = getMoviePosterUrl(movie)
  const popularity = getMoviePopularity(movie)
  const character = getMovieCharacterText(movie)
  const id = getMovieId(movie)

  return (
    <div className="movie-card" role="group" aria-label={title || id}>
      <button type="button" className="movie-poster" onClick={() => onOpenDetails(movie)}>
        {posterUrl ? (
          <img src={posterUrl} alt={title ? `${title} poster` : 'Movie poster'} loading="lazy" />
        ) : (
          <div className="movie-poster-fallback">No poster</div>
        )}
      </button>

      <div className="movie-body">
        <div className="movie-title-row">
          <div className="movie-title">{title || 'Untitled'}</div>
          <button
            type="button"
            className={['fav', isFavorite ? 'fav-on' : ''].filter(Boolean).join(' ')}
            aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            onClick={() => onToggleFavorite(movie)}
          >
            {isFavorite ? '★' : '☆'}
          </button>
        </div>

        {subtitle ? <div className="movie-subtitle">{subtitle}</div> : null}

        <div className="movie-meta">
          {typeof popularity === 'number' ? (
            <div className="pill">Popularity: {popularity.toFixed(1)}</div>
          ) : (
            <div className="pill pill-muted">Popularity: N/A</div>
          )}
          {character ? <div className="pill pill-muted">Character: {character}</div> : null}
        </div>

        <div className="movie-actions">
          <Button variant="secondary" type="button" onClick={() => onOpenDetails(movie)}>
            Details
          </Button>
        </div>
      </div>
    </div>
  )
}

