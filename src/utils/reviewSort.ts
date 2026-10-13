import type { GameReview } from '../types'

export type SortMode = 'release' | 'rating' | 'alphabetical'

/**
 * Returns timestamp (in ms) for the review release date.
 * Falls back to January 1st of review.year if postedOn is not specified or invalid.
 */
export function parseReleaseTime(review: GameReview): number {
  if (review.postedOn) {
    const time = Date.parse(review.postedOn)
    if (!Number.isNaN(time)) {
      return time
    }
  }
  return new Date(review.year, 0, 1).getTime()
}

/**
 * Compares two reviews by release date in descending order (newest first).
 */
export function compareReleaseDate(a: GameReview, b: GameReview): number {
  const timeA = parseReleaseTime(a)
  const timeB = parseReleaseTime(b)
  if (timeB !== timeA) {
    return timeB - timeA
  }
  const strA = a.postedOn ?? `${a.year}-01-01`
  const strB = b.postedOn ?? `${b.year}-01-01`
  return strB.localeCompare(strA)
}

/**
 * Sorts an array of reviews based on the chosen SortMode.
 * - 'release': Newest release date first.
 * - 'rating': Highest rating first; ties broken by release date (newest first).
 * - 'alphabetical': Game title A-Z; ties broken by release date (newest first).
 */
export function sortReviews(reviews: GameReview[], sortMode: SortMode): GameReview[] {
  const indexed = reviews.map((review, index) => ({ review, index }))

  indexed.sort((a, b) => {
    if (sortMode === 'rating') {
      const ratingA = a.review.rating ?? -1
      const ratingB = b.review.rating ?? -1
      if (ratingB !== ratingA) {
        return ratingB - ratingA
      }
      const dateDiff = compareReleaseDate(a.review, b.review)
      if (dateDiff !== 0) {
        return dateDiff
      }
      return a.index - b.index
    }

    if (sortMode === 'alphabetical') {
      const titleCompare = a.review.title.localeCompare(b.review.title, undefined, {
        sensitivity: 'base',
        numeric: true,
      })
      if (titleCompare !== 0) {
        return titleCompare
      }
      const dateDiff = compareReleaseDate(a.review, b.review)
      if (dateDiff !== 0) {
        return dateDiff
      }
      return a.index - b.index
    }

    // sortMode === 'release'
    const dateDiff = compareReleaseDate(a.review, b.review)
    if (dateDiff !== 0) {
      return dateDiff
    }
    return a.index - b.index
  })

  return indexed.map((item) => item.review)
}
