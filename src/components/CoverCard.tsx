import { Link } from 'react-router-dom'
import type { GameReview } from '../types'

type CoverCardProps = {
  review: GameReview
  rank?: number
}

function coverLabel(review: GameReview, rank?: number): string {
  const parts = [`Read review of ${review.title}`]
  if (rank != null) {
    parts.push(`ranked #${rank}`)
  }
  if (review.rating != null) {
    parts.push(`rated ${review.rating} out of 10`)
  }
  const verdict = review.verdict ?? review.summary
  if (verdict) {
    parts.push(verdict)
  } else if (review.recommended != null) {
    parts.push(review.recommended ? 'recommended' : 'not recommended')
  }
  return parts.join(', ')
}

export function CoverCard({ review, rank }: CoverCardProps) {
  return (
    <Link className="cover-card" to={`/${review.year}/${review.slug}`} aria-label={coverLabel(review, rank)}>
      <img
        src={review.coverUrl}
        alt=""
        width={600}
        height={900}
        loading="lazy"
      />
      {review.rating != null && (
        <span className={review.rating === 10 ? 'cover-rating is-gold' : 'cover-rating'}>
          {review.rating}/10
        </span>
      )}
      {rank != null && (
        <span className={`cover-rank ${rank <= 3 ? `is-rank-${rank}` : ''}`}>
          #{rank}
        </span>
      )}
    </Link>
  )
}
