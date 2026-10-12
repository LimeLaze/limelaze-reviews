import { useEffect, useState } from 'react'
import { fetchReviews, fetchSite } from '../api/data'
import type { GameReview, SiteConfig } from '../types'

export type SiteData = {
  site: SiteConfig
  reviews: GameReview[]
}

export function useSiteData(): {
  data: SiteData | null
  error: string | null
} {
  const [data, setData] = useState<SiteData | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    Promise.all([fetchSite(), fetchReviews()])
      .then(([site, reviews]) => {
        if (!cancelled) {
          setData({ site, reviews })
        }
      })
      .catch((cause: unknown) => {
        if (!cancelled) {
          setError(cause instanceof Error ? cause.message : 'Failed to load site data')
        }
      })

    return () => {
      cancelled = true
    }
  }, [])

  return { data, error }
}

export function latestYear(years: number[]): number {
  return Math.max(...years)
}
