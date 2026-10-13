import { useEffect } from 'react'
import type { GameReview } from '../types'

type ReviewDialogProps = {
  review: GameReview | null
  onClose: () => void
}

function postedLabel(review: GameReview): string {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(review.postedOn ?? '')
  if (!match) {
    return String(review.year)
  }

  const date = new Date(Date.UTC(Number(match[1]), Number(match[2]) - 1, Number(match[3])))
  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(date)
}

export function ReviewDialog({ review, onClose }: ReviewDialogProps) {
  useEffect(() => {
    if (!review) {
      return
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    document.addEventListener('keydown', onKeyDown)
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = previousOverflow
    }
  }, [review, onClose])

  if (!review) {
    return null
  }

  const verdictText =
    review.verdict ??
    review.summary ??
    (review.recommended != null ? (review.recommended ? 'Recommended' : 'Not recommended') : null)

  return (
    <div className="dialog-backdrop" onClick={onClose} role="presentation">
      <div
        className="dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="review-title"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="dialog-cover-wrap">
          <img
            className="dialog-cover"
            src={review.coverUrl}
            alt=""
            width={200}
            height={300}
          />
          {review.rating != null && (
            <span className={review.rating === 10 ? 'cover-rating is-gold' : 'cover-rating'}>
              {review.rating}/10
            </span>
          )}
        </div>
        <div className="dialog-body">
          <p className="dialog-year">{postedLabel(review)}</p>
          <h2 id="review-title">{review.title}</h2>
          {verdictText && (
            <p className={review.recommended === false ? 'dialog-verdict is-not-recommended' : 'dialog-verdict is-recommended'}>
              {verdictText}
            </p>
          )}
          <p className="dialog-text">{review.body}</p>
          <button type="button" className="dialog-close" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
