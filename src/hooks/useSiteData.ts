import { useEffect, useState } from 'react'
import { fetchReviews, fetchSite, fetchSorting, fetchSoundtracks } from '../api/data'
import type { GameReview, SiteConfig, SoundtracksData, SortingData } from '../types'
import { DEFAULT_RANKING, DEFAULT_SORTING_DESCRIPTIONS, sortReviews } from '../utils/reviewSort'

export type SiteData = {
  site: SiteConfig
  reviews: GameReview[]
  sorting: SortingData
  soundtracks: SoundtracksData
}

const FALLBACK_SORTING: SortingData = {
  descriptions: DEFAULT_SORTING_DESCRIPTIONS,
  ranking: DEFAULT_RANKING,
}

const FALLBACK_SOUNDTRACKS: SoundtracksData = {
  description: DEFAULT_SORTING_DESCRIPTIONS.soundtrack,
  ranking: DEFAULT_RANKING,
}

export function useSiteData(): {
  data: SiteData | null
  error: string | null
} {
  const [data, setData] = useState<SiteData | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    Promise.all([
      fetchSite(),
      fetchReviews(),
      fetchSorting().catch(() => FALLBACK_SORTING),
      fetchSoundtracks().catch(() => FALLBACK_SOUNDTRACKS),
    ])
      .then(([site, reviews, sorting, soundtracks]) => {
        if (!cancelled) {
          setData({
            site,
            reviews: sortReviews(
              reviews,
              'release',
              sorting?.ranking ?? DEFAULT_RANKING,
              soundtracks?.ranking ?? DEFAULT_RANKING,
            ),
            sorting: sorting ?? FALLBACK_SORTING,
            soundtracks: soundtracks ?? FALLBACK_SOUNDTRACKS,
          })
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
