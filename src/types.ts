export type SocialLink = {
  label: string
  url: string
}

export type SiteConfig = {
  years: number[]
  socialLinks: SocialLink[]
}

export type GameReview = {
  id: string
  slug: string
  title: string
  year: number
  coverUrl: string
  steamAppId?: number
  /** Calendar date the review was posted, YYYY-MM-DD. */
  postedOn?: string
  body: string
  recommended?: boolean
  /** Single-sentence summary or review verdict (e.g. "A masterpiece from start to finish"). */
  verdict?: string
  /** Alias for verdict. */
  summary?: string
  /** Whole number from 0 to 10. Omit when the game has no score. */
  rating?: number
}

export type Top20Game = {
  rank: number
  title: string
  description: string
  coverUrl: string
}

export type Top20Data = {
  comments?: string
  intro?: string
  games: Top20Game[]
}

export type AboutData = {
  title: string
  content: string
}

export type SortMode = 'release' | 'perfect' | 'rating' | 'alphabetical'

export type SortingDescriptions = Partial<Record<SortMode, string>>

export type SortingData = {
  descriptions?: SortingDescriptions
  ranking?: string[]
}


