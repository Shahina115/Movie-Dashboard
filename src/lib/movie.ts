export type Movie = Record<string, unknown>

export function getMovieId(movie: Movie) {
  const candidates = [
    movie.id,
    movie._id,
    movie.imdbID,
    movie.imdbId,
    movie.slug,
    movie.title,
    movie.name,
  ]

  const first = candidates.find((c) => typeof c === 'string' || typeof c === 'number')
  return String(first ?? '')
}

export function getMovieTitle(movie: Movie) {
  const title =
    (typeof movie.title === 'string' && movie.title) ||
    (typeof movie.name === 'string' && movie.name) ||
    (typeof movie.movie_title === 'string' && movie.movie_title) ||
    ''
  return title
}

export function getMoviePosterUrl(movie: Movie) {
  const candidates = [
    movie.poster,
    movie.poster_url,
    movie.posterUrl,
    movie.image,
    movie.img,
    movie.thumbnail,
    movie.thumbnailUrl,
  ]
  const first = candidates.find((c) => typeof c === 'string' && c.length > 0)
  return (first as string | undefined) ?? ''
}

export function getMoviePopularity(movie: Movie) {
  const candidates = [
    movie.popularity,
    movie.popularity_score,
    movie.popularityScore,
    movie.rating,
    movie.vote_average,
    movie.voteAverage,
  ]
  const first = candidates.find((c) => typeof c === 'number' && Number.isFinite(c))
  return (first as number | undefined) ?? null
}

export function getMovieSubtitle(movie: Movie) {
  const year =
    (typeof movie.year === 'number' && String(movie.year)) ||
    (typeof movie.release_year === 'number' && String(movie.release_year)) ||
    (typeof movie.releaseYear === 'number' && String(movie.releaseYear)) ||
    ''
  const genre =
    (typeof movie.genre === 'string' && movie.genre) ||
    (typeof movie.genres === 'string' && movie.genres) ||
    ''
  const parts = [year, genre].filter(Boolean)
  return parts.join(' • ')
}

export function getMovieCharacterText(movie: Movie) {
  const direct =
    (typeof movie.character === 'string' && movie.character) ||
    (typeof movie.character_name === 'string' && movie.character_name) ||
    (typeof movie.characterName === 'string' && movie.characterName) ||
    ''
  if (direct) return direct

  const characters = movie.characters
  if (Array.isArray(characters)) {
    const names = characters
      .map((c) => {
        if (typeof c === 'string') return c
        if (c && typeof c === 'object') {
          const obj = c as Record<string, unknown>
          if (typeof obj.name === 'string') return obj.name
          if (typeof obj.character === 'string') return obj.character
        }
        return ''
      })
      .filter(Boolean)
    return names.join(', ')
  }

  return ''
}

export function matchesMovieSearch(movie: Movie, rawQuery: string) {
  const query = rawQuery.trim().toLowerCase()
  if (!query) return true

  const title = getMovieTitle(movie).toLowerCase()
  const character = getMovieCharacterText(movie).toLowerCase()

  return title.includes(query) || character.includes(query)
}

