import type { GameReview, SortMode } from '../types'

export type { SortMode }

export const DEFAULT_SORTING_DESCRIPTIONS: Record<SortMode, string> = {
  release: 'Reviews in order of release date, newest to oldest.',
  perfect: 'My personal definitive ranking from best to worst.',
  soundtrack: 'Ranked by my personal favorite game soundtracks.',
  rating: 'Sorted by rating (10 to 0), with release order breaking ties.',
  alphabetical: 'Sorted alphabetically by title from A to Z.',
}

export const DEFAULT_RANKING: string[] = [
  'Spiritfarer',
  'Bloodborne',
  'Slay the Princess',
  'In Stars And Time',
  'Metal Gear Solid 4: Guns of the Patriots',
  'Cyberpunk 2077: Phantom Liberty',
  'Sekiro Shadows Die Twice',
  'UNBEATABLE',
  'CONTROL RESONANT',
  'DELTARUNE Chapter 5',
  'Cairn',
  'Dispatch',
  'DOOM: The Dark Ages | Revelations',
  'Cyberpunk 2077',
  'Metal Gear Solid 2: Sons of Liberty',
  'Metal Gear Solid V: The Phantom Pain',
  'Dark Souls Remastered',
  '1000xRESIST',
  'Crypt of the Necrodancer',
  'HITMAN World of Assasination',
  'Hi-Fi Rush',
  'Rift of the NecroDancer',
  'Risk of Rain 2: Hallowed Concepts',
  'SUPERHOT',
  'Toree Saturn',
  'Final Fantasy XVI',
  'What Remains of Edith Finch',
  'Demon’s Souls',
  'Demon’s Souls (Remake)',
  'Marvel’s Wolverine',
  'Dark Souls II: Scholar of the First Sin',
  'Dead as Disco (Early Access)',
  'Minecraft Dungeons: Ultimate Edition',
  'Elden Ring Nightreign: The Forsaken Hollows',
  'Poker Night at the Inventory',
  'Metal Gear Solid',
  'Castle Crashers',
  'Devil May Cry',
  '(Metal Gear Solid V: Ground Zeroes)',
]

function normalize(s: string): string {
  return (s || '')
    .toLowerCase()
    .replace(/[™®©]/g, '')
    .replace(/[’']/g, "'")
    .replace(/[—–-]/g, ' ')
    .replace(/[()]/g, '')
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

function getMatchScore(review: GameReview, entry: string): number {
  const normEntry = normalize(entry)
  const normTitle = normalize(review.title)
  const normSlug = normalize(review.slug)
  const normId = normalize(review.id)
  const compactEntry = normEntry.replace(/\s+/g, '')
  const compactSlug = normSlug.replace(/\s+/g, '')

  if (entry.toLowerCase() === review.title.toLowerCase()) return 1000
  if (entry.toLowerCase() === review.slug.toLowerCase()) return 1000
  if (normEntry === normTitle) return 900
  if (compactEntry === compactSlug) return 850

  // Remake / subtitle match (e.g. Demon's Souls (Remake) with slug 'demonssoulsremake')
  if (normEntry.includes('remake') && (normSlug.includes('remake') || normId.includes('remake'))) return 800

  // Typo tolerance (e.g. Assasination vs Assassination)
  if (normTitle.replace(/ss/g, 's') === normEntry.replace(/ss/g, 's')) {
    return 700
  }

  // Starts with match (e.g. "Sekiro Shadows Die Twice" in "Sekiro™: Shadows Die Twice - GOTY Edition")
  if (normTitle.startsWith(normEntry) && (normTitle.length === normEntry.length || normTitle[normEntry.length] === ' ')) {
    return 500 + normEntry.length
  }
  if (normEntry.startsWith(normTitle) && (normEntry.length === normTitle.length || normEntry[normTitle.length] === ' ')) {
    return 400 + normTitle.length
  }

  return 0
}

export function findReviewRank(review: GameReview, ranking: string[]): number {
  let bestScore = 0
  let bestRank = -1

  for (let i = 0; i < ranking.length; i++) {
    const score = getMatchScore(review, ranking[i])
    if (score > bestScore) {
      bestScore = score
      bestRank = i
    }
  }

  return bestRank
}

/**
 * Returns timestamp (in ms) for the review release date.
 * Falls back to January 1st of review.year if postedOn is not specified or invalid.
 */
export function parseReleaseTime(review: GameReview): number {
  if (review.postedOn) {
    const time = Date.parse(review.postedOn)
    if (!Number.isNaN(time)) {
      return time
    }
  }
  return new Date(review.year, 0, 1).getTime()
}

/**
 * Compares two reviews by release date in descending order (newest first).
 */
export function compareReleaseDate(a: GameReview, b: GameReview): number {
  const timeA = parseReleaseTime(a)
  const timeB = parseReleaseTime(b)
  if (timeB !== timeA) {
    return timeB - timeA
  }
  const strA = a.postedOn ?? `${a.year}-01-01`
  const strB = b.postedOn ?? `${b.year}-01-01`
  return strB.localeCompare(strA)
}

/**
 * Sorts an array of reviews based on the chosen SortMode.
 * - 'release': Newest release date first.
 * - 'perfect': Ranked according to ranking list (1st to last); unranked at the end.
 * - 'soundtrack': Ranked according to soundtrack ranking list (1st to last); unranked at the end.
 * - 'rating': Highest rating first; ties broken by release date (newest first).
 * - 'alphabetical': Game title A-Z; ties broken by release date (newest first).
 */
export function sortReviews(
  reviews: GameReview[],
  sortMode: SortMode,
  ranking: string[] = DEFAULT_RANKING,
  soundtrackRanking: string[] = DEFAULT_RANKING,
): GameReview[] {
  const indexed = reviews.map((review, index) => ({ review, index }))

  indexed.sort((a, b) => {
    if (sortMode === 'perfect' || sortMode === 'soundtrack') {
      const activeList = sortMode === 'soundtrack' ? soundtrackRanking : ranking
      const rankA = findReviewRank(a.review, activeList)
      const rankB = findReviewRank(b.review, activeList)

      if (rankA !== -1 && rankB !== -1) {
        if (rankA !== rankB) {
          return rankA - rankB
        }
      } else if (rankA !== -1 && rankB === -1) {
        return -1
      } else if (rankA === -1 && rankB !== -1) {
        return 1
      } else {
        // Both are unranked: sort by rating descending, then release date
        const ratingA = a.review.rating ?? -1
        const ratingB = b.review.rating ?? -1
        if (ratingB !== ratingA) {
          return ratingB - ratingA
        }
      }

      const dateDiff = compareReleaseDate(a.review, b.review)
      if (dateDiff !== 0) {
        return dateDiff
      }
      return a.index - b.index
    }

    if (sortMode === 'rating') {
      const ratingA = a.review.rating ?? -1
      const ratingB = b.review.rating ?? -1
      if (ratingB !== ratingA) {
        return ratingB - ratingA
      }
      const dateDiff = compareReleaseDate(a.review, b.review)
      if (dateDiff !== 0) {
        return dateDiff
      }
      return a.index - b.index
    }

    if (sortMode === 'alphabetical') {
      const titleCompare = a.review.title.localeCompare(b.review.title, undefined, {
        sensitivity: 'base',
        numeric: true,
      })
      if (titleCompare !== 0) {
        return titleCompare
      }
      const dateDiff = compareReleaseDate(a.review, b.review)
      if (dateDiff !== 0) {
        return dateDiff
      }
      return a.index - b.index
    }

    // sortMode === 'release'
    const dateDiff = compareReleaseDate(a.review, b.review)
    if (dateDiff !== 0) {
      return dateDiff
    }
    return a.index - b.index
  })

  return indexed.map((item) => item.review)
}
