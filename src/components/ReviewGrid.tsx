import { useMemo, useState } from 'react'
import type { GameReview } from '../types'
import { type SortMode, sortReviews } from '../utils/reviewSort'
import { CoverCard } from './CoverCard'

type ReviewGridProps = {
  year: number
  reviews: GameReview[]
}

export type { SortMode }

interface SortOption {
  id: SortMode
  label: string
  title: string
}

const SORT_OPTIONS: SortOption[] = [
  { id: 'release', label: 'Release Order', title: 'Sort by review release order' },
  { id: 'rating', label: 'Rating', title: 'Sort by rating (highest first)' },
  { id: 'alphabetical', label: 'Alphabetical', title: 'Sort alphabetically (A-Z)' },
]

export function ReviewGrid({ year, reviews }: ReviewGridProps) {
  const [sortMode, setSortMode] = useState<SortMode>('release')

  const sortedReviews = useMemo(() => {
    return sortReviews(reviews, sortMode)
  }, [reviews, sortMode])

  if (reviews.length === 0) {
    return (
      <div className="empty-grid">
        <p className="empty-title">No one hears a word, they say...</p>
        <p className="empty-subtitle">Check back later for {year} game reviews.</p>
      </div>
    )
  }

  return (
    <div className="year-grid-section">
      <h1 className="grid-title">Games I've played in {year}</h1>
      <div className="grid-sort-controls" role="group" aria-label="Sort reviews">
        {SORT_OPTIONS.map((option) => (
          <button
            key={option.id}
            type="button"
            className={`sort-button ${sortMode === option.id ? 'is-active' : ''}`}
            aria-pressed={sortMode === option.id}
            title={option.title}
            onClick={() => setSortMode(option.id)}
          >
            {option.label}
          </button>
        ))}
      </div>
      <ul className="review-grid">
        {sortedReviews.map((review) => (
          <li key={review.id}>
            <CoverCard review={review} />
          </li>
        ))}
      </ul>
    </div>
  )
}
