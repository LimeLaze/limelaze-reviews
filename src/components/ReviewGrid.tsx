import type { GameReview } from '../types'
import { CoverCard } from './CoverCard'

type ReviewGridProps = {
  year: number
  reviews: GameReview[]
}

export function ReviewGrid({ year, reviews }: ReviewGridProps) {
  if (reviews.length === 0) {
    return (
      <div className="empty-grid">
        <p className="empty-title">No one hears a word, they say...</p>
        <p className="empty-subtitle">Check back later for {year} game reviews.</p>
      </div>
    )
  }

  return (
    <ul className="review-grid">
      {reviews.map((review) => (
        <li key={review.id}>
          <CoverCard review={review} />
        </li>
      ))}
    </ul>
  )
}
