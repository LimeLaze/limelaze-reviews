import type { GameReview, SiteConfig } from '../types'

function dataUrl(file: string): string {
  return `${import.meta.env.BASE_URL}data/${file}`
}

async function fetchJson<T>(url: string): Promise<T> {
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`Failed to load ${url} (${response.status})`)
  }
  return (await response.json()) as T
}

export function fetchSite(): Promise<SiteConfig> {
  return fetchJson<SiteConfig>(dataUrl('site.json'))
}

export function fetchReviews(): Promise<GameReview[]> {
  return fetchJson<GameReview[]>(dataUrl('reviews.json'))
}
