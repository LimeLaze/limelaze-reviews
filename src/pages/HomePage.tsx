import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { fetchHome } from '../api/data'
import { ReviewCardContent } from '../components/ReviewCardContent'
import { compareReleaseDate } from '../utils/reviewSort'
import { useLayoutData } from './layoutContext'

const DEFAULT_TITLE = "Lime's Den of Reviews"
const DEFAULT_DESCRIPTION =
  "Test"

export function HomePage() {
  const { site, reviews } = useLayoutData()
  const [title, setTitle] = useState(DEFAULT_TITLE)
  const [description, setDescription] = useState(DEFAULT_DESCRIPTION)

  useEffect(() => {
    let cancelled = false
    fetchHome()
      .then((data) => {
        if (!cancelled) {
          if (data.title) setTitle(data.title)
          if (data.description) setDescription(data.description)
        }
      })
      .catch(() => {
        // Keep default description and title on error
      })

    return () => {
      cancelled = true
    }
  }, [])

  const latestReview = useMemo(() => {
    if (!reviews || reviews.length === 0) return null
    return [...reviews].sort(compareReleaseDate)[0]
  }, [reviews])

  const [currentYear] = useState(() => new Date().getFullYear())

  const targetYear = useMemo(() => {
    if (site.years.includes(currentYear)) {
      return currentYear
    }
    if (site.years.length > 0) {
      return Math.max(...site.years)
    }
    return latestReview?.year ?? currentYear
  }, [site.years, currentYear, latestReview?.year])

  return (
    <div className="home-page">
      <section className="home-hero">
        <h1 className="home-logo">{title}</h1>
        {description && <p className="home-description">{description}</p>}
      </section>

      {latestReview && (
        <section className="home-latest-section" aria-label="Latest review">
          <h2 className="home-latest-title">The latest review of mine:</h2>

          <article className="home-review-card">
            <ReviewCardContent review={latestReview} />
          </article>

          <div className="home-latest-footer">
            <Link
              to={`/${targetYear}`}
              className="home-other-reviews-link"
              onClick={() => {
                window.scrollTo(0, 0)
              }}
            >
              <span>Check out my other reviews from this year</span>
              <span aria-hidden="true">&rarr;</span>
            </Link>
          </div>
        </section>
      )}
    </div>
  )
}
