import { useMemo, useState } from 'react'
import type { GameReview, SoundtracksData, SortingData } from '../types'
import {
  DEFAULT_RANKING,
  DEFAULT_SORTING_DESCRIPTIONS,
  type SortMode,
  sortReviews,
} from '../utils/reviewSort'
import { CoverCard } from './CoverCard'

type ReviewGridProps = {
  year: number
  reviews: GameReview[]
  sorting?: SortingData
  soundtracks?: SoundtracksData
}

export type { SortMode }

interface SortOption {
  id: SortMode
  label: string
  title: string
}

const SORT_OPTIONS: SortOption[] = [
  { id: 'release', label: 'Release Order', title: 'Sort by review release order' },
  { id: 'perfect', label: 'Perfectly Ranked', title: 'Sort by my personal definitive ranking' },
  { id: 'soundtrack', label: 'Soundtracks Ranked', title: 'Sort by my personal soundtrack ranking' },
  { id: 'rating', label: 'Rating', title: 'Sort by rating (highest first)' },
  { id: 'alphabetical', label: 'Alphabetical', title: 'Sort alphabetically (A-Z)' },
]

export function ReviewGrid({ year, reviews, sorting, soundtracks }: ReviewGridProps) {
  const [sortMode, setSortMode] = useState<SortMode>('release')

  const rankingList = sorting?.ranking ?? DEFAULT_RANKING
  const soundtrackRankingList = soundtracks?.ranking ?? DEFAULT_RANKING

  const sortedReviews = useMemo(() => {
    return sortReviews(reviews, sortMode, rankingList, soundtrackRankingList)
  }, [reviews, sortMode, rankingList, soundtrackRankingList])

  const activeDescription =
    sortMode === 'soundtrack'
      ? soundtracks?.description ??
        soundtracks?.descriptions?.soundtrack ??
        sorting?.descriptions?.soundtrack ??
        DEFAULT_SORTING_DESCRIPTIONS.soundtrack
      : sorting?.descriptions?.[sortMode] ?? DEFAULT_SORTING_DESCRIPTIONS[sortMode]

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
        <span className="sort-label">Sort by</span>
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
      {activeDescription && (
        <p className="sort-description">{activeDescription}</p>
      )}
      <ul className="review-grid">
        {sortedReviews.map((review, index) => (
          <li key={review.id}>
            <CoverCard
              review={review}
              rank={sortMode === 'perfect' || sortMode === 'soundtrack' ? index + 1 : undefined}
            />
          </li>
        ))}
      </ul>
    </div>
  )
}
