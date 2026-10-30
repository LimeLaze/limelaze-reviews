import { useCallback, useEffect } from 'react'
import type { GameReview } from '../types'
import { ReviewCardContent } from './ReviewCardContent'

type ReviewDialogProps = {
  review: GameReview
  onClose: () => void
}

export function ReviewDialog({ review, onClose }: ReviewDialogProps) {
  const handleClose = useCallback(() => {
    onClose()
  }, [onClose])

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        handleClose()
      }
    }

    document.addEventListener('keydown', onKeyDown)
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = previousOverflow
    }
  }, [handleClose])

  return (
    <div className="dialog-backdrop" onClick={handleClose} role="presentation">
      <div
        className="dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="review-title"
        onClick={(event) => event.stopPropagation()}
      >
        <ReviewCardContent review={review} titleId="review-title">
          <button type="button" className="dialog-close" onClick={handleClose}>
            Close
          </button>
        </ReviewCardContent>
      </div>
    </div>
  )
}
