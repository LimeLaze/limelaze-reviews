import { useCallback } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import { ReviewDialog } from '../components/ReviewDialog'
import { ReviewGrid } from '../components/ReviewGrid'
import { useLayoutData } from './layoutContext'

function parseYear(value: string | undefined): number | null {
  if (!value) {
    return null
  }
  const year = Number(value)
  return Number.isInteger(year) ? year : null
}

export function YearPage() {
  const { year: yearParam, slug } = useParams()
  const navigate = useNavigate()
  const { reviews } = useLayoutData()
  const year = parseYear(yearParam)

  if (year == null) {
    return <Navigate to="/" replace />
  }

  const yearReviews = reviews.filter((review) => review.year === year)
  const openReview = slug
    ? (yearReviews.find((review) => review.slug === slug) ?? null)
    : null
  const closeDialog = useCallback(() => {
    void navigate(`/${year}`)
  }, [navigate, year])

  return (
    <section className="year-page">
      <h1 className="visually-hidden">{year} reviews</h1>
      <ReviewGrid year={year} reviews={yearReviews} />
      <ReviewDialog review={openReview} onClose={closeDialog} />
    </section>
  )
}
