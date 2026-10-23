import { useCallback, useEffect, useState } from 'react'
import type { GameReview } from '../types'

type ReviewDialogProps = {
  review: GameReview
  onClose: () => void
}

function extractYouTubeId(urlOrId: string | undefined): string | null {
  if (!urlOrId) return null
  const trimmed = urlOrId.trim()
  if (!trimmed) return null

  // 11-character video ID (e.g. dQw4w9WgXcQ)
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
    return trimmed
  }

  // youtu.be short link
  const shortMatch = trimmed.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/i)
  if (shortMatch) {
    return shortMatch[1]
  }

  // youtube.com embed link
  const embedMatch = trimmed.match(/youtube(?:-nocookie)?\.com\/embed\/([a-zA-Z0-9_-]{11})/i)
  if (embedMatch) {
    return embedMatch[1]
  }

  // youtube.com watch, shorts, or v link
  const watchMatch = trimmed.match(/(?:youtube\.com\/(?:watch\?(?:.*&)?v=|shorts\/|v\/))([a-zA-Z0-9_-]{11})/i)
  if (watchMatch) {
    return watchMatch[1]
  }

  return null
}

function getYouTubeEmbedUrl(urlOrId: string | undefined): string | null {
  const id = extractYouTubeId(urlOrId)
  if (!id) return null
  return `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`
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
  const [activeMedia, setActiveMedia] = useState<'trailer' | 'soundtrack' | null>(null)

  const handleClose = useCallback(() => {
    setActiveMedia(null)
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

  const trailerEmbedUrl = getYouTubeEmbedUrl(review.trailer ?? review.trailerUrl)
  const soundtrackEmbedUrl = getYouTubeEmbedUrl(review.soundtrack ?? review.soundtrackUrl)
  const hasTrailer = Boolean(trailerEmbedUrl)
  const hasSoundtrack = Boolean(soundtrackEmbedUrl)

  const activeEmbedUrl =
    activeMedia === 'trailer'
      ? trailerEmbedUrl
      : activeMedia === 'soundtrack'
        ? soundtrackEmbedUrl
        : null

  const verdictText =
    review.verdict ??
    review.summary ??
    (review.recommended != null ? (review.recommended ? 'Recommended' : 'Not recommended') : null)

  return (
    <div className="dialog-backdrop" onClick={handleClose} role="presentation">
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

          {(hasTrailer || hasSoundtrack) && (
            <div className="dialog-media-section">
              <div className="dialog-media-buttons" role="group" aria-label="Media preview options">
                {hasTrailer && (
                  <button
                    type="button"
                    className={`dialog-media-btn ${activeMedia === 'trailer' ? 'is-active' : ''}`}
                    onClick={() => setActiveMedia((curr) => (curr === 'trailer' ? null : 'trailer'))}
                    aria-expanded={activeMedia === 'trailer'}
                    aria-controls="dialog-video-player"
                  >
                    <svg
                      className="dialog-media-icon"
                      viewBox="0 0 16 16"
                      width="12"
                      height="12"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path d="M4 2.5v11l9-5.5-9-5.5z" />
                    </svg>
                    <span>{activeMedia === 'trailer' ? 'Hide Trailer' : 'Watch Trailer'}</span>
                  </button>
                )}

                {hasSoundtrack && (
                  <button
                    type="button"
                    className={`dialog-media-btn ${activeMedia === 'soundtrack' ? 'is-active' : ''}`}
                    onClick={() => setActiveMedia((curr) => (curr === 'soundtrack' ? null : 'soundtrack'))}
                    aria-expanded={activeMedia === 'soundtrack'}
                    aria-controls="dialog-video-player"
                  >
                    <svg
                      className="dialog-media-icon"
                      viewBox="0 0 16 16"
                      width="12"
                      height="12"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path d="M6 3v7.5A2.5 2.5 0 1 0 8.5 13V6h5V3H6z" />
                    </svg>
                    <span>{activeMedia === 'soundtrack' ? 'Hide Soundtrack' : 'Example of the Soundtrack'}</span>
                  </button>
                )}
              </div>

              {activeMedia && activeEmbedUrl && (
                <div id="dialog-video-player" className="dialog-video-wrap">
                  <iframe
                    src={activeEmbedUrl}
                    title={activeMedia === 'trailer' ? `${review.title} — Trailer` : `${review.title} — Soundtrack Example`}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />
                </div>
              )}
            </div>
          )}

          <button type="button" className="dialog-close" onClick={handleClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
