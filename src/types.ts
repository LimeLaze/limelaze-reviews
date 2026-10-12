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
  /** Whole number from 0 to 10. Omit when the game has no score. */
  rating?: number
}
