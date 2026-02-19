import type { Movie } from './movie'

export type MoviesPage = {
  currentPage: number
  totalPages: number
  data: Movie[]
}

function readNumber(value: unknown) {
  return typeof value === 'number' && Number.isFinite(value) ? value : null
}

function readArray(value: unknown) {
  return Array.isArray(value) ? value : null
}

export async function fetchMoviesPage(page: number, signal?: AbortSignal): Promise<MoviesPage> {
  const template = import.meta.env.VITE_MOVIES_API_URL_TEMPLATE as string | undefined
  if (!template) {
    throw new Error('Missing VITE_MOVIES_API_URL_TEMPLATE')
  }

  const url = template.replace('{{page}}', String(page))

  const response = await fetch(url, { signal })
  if (!response.ok) {
    throw new Error(`Movies API failed (${response.status})`)
  }

  const json = (await response.json()) as Record<string, unknown>
  const rawCurrentPage =
    readNumber(json.current_page) ??
    readNumber(json.currentPage) ??
    readNumber(json.page) ??
    page
  const rawTotalPages =
    readNumber(json.total_pages) ?? readNumber(json.totalPages) ?? readNumber(json.pages) ?? 1
  const rawData = readArray(json.data) ?? readArray(json.results) ?? []

  return {
    currentPage: rawCurrentPage,
    totalPages: rawTotalPages,
    data: rawData as Movie[],
  }
}

