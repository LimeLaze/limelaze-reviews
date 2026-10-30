import { useState, type ReactNode } from 'react'
import type { GameReview } from '../types'
import { getYouTubeEmbedUrl, postedLabel } from '../utils/reviewMedia'

type ReviewCardContentProps = {
  review: GameReview
  titleId?: string
  children?: ReactNode
}

export function ReviewCardContent({ review, titleId, children }: ReviewCardContentProps) {
  const [activeMedia, setActiveMedia] = useState<'trailer' | 'soundtrack' | null>(null)

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
    <>
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
        <h2 id={titleId}>{review.title}</h2>
        {verdictText && (
          <p
            className={
              review.recommended === false
                ? 'dialog-verdict is-not-recommended'
                : 'dialog-verdict is-recommended'
            }
          >
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
                  title={
                    activeMedia === 'trailer'
                      ? `${review.title} — Trailer`
                      : `${review.title} — Soundtrack Example`
                  }
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              </div>
            )}
          </div>
        )}

        {children}
      </div>
    </>
  )
}
