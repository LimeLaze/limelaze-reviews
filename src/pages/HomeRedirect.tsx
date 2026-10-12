import { Navigate } from 'react-router-dom'
import { latestYear } from '../hooks/useSiteData'
import { useLayoutData } from './layoutContext'

export function HomeRedirect() {
  const { site, reviews } = useLayoutData()
  const yearsWithReviews = site.years.filter((year) =>
    reviews.some((review) => review.year === year),
  )
  const defaultYear =
    yearsWithReviews.length > 0
      ? Math.max(...yearsWithReviews)
      : latestYear(site.years)

  return <Navigate to={`/${defaultYear}`} replace />
}
