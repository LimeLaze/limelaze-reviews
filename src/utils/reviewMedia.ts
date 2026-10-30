import type { GameReview } from '../types'

export function extractYouTubeId(urlOrId: string | undefined): string | null {
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

export function getYouTubeEmbedUrl(urlOrId: string | undefined): string | null {
  const id = extractYouTubeId(urlOrId)
  if (!id) return null
  return `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`
}

export function postedLabel(review: GameReview): string {
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
