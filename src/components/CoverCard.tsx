import { Link } from 'react-router-dom'
import type { GameReview } from '../types'

type CoverCardProps = {
  review: GameReview
}

function coverLabel(review: GameReview): string {
  const parts = [`Read review of ${review.title}`]
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

export function CoverCard({ review }: CoverCardProps) {
  return (
    <Link className="cover-card" to={`/${review.year}/${review.slug}`} aria-label={coverLabel(review)}>
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
    </Link>
  )
}
