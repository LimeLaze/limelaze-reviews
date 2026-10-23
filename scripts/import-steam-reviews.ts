import { readFile, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import type { GameReview, SiteConfig } from '../src/types.ts'

const PROFILE_REVIEWS_URL = 'https://steamcommunity.com/id/LimeLaze/reviews/'
const MIN_YEAR = 2026
const root = resolve(import.meta.dirname, '..')
const reviewsPath = resolve(root, 'public/data/reviews.json')
const sitePath = resolve(root, 'public/data/site.json')

const MONTHS: Record<string, number> = {
  january: 1,
  february: 2,
  march: 3,
  april: 4,
  may: 5,
  june: 6,
  july: 7,
  august: 8,
  september: 9,
  october: 10,
  november: 11,
  december: 12,
}

type ParsedReview = {
  steamAppId: number
  body: string
  recommended: boolean
  postedOn: string
  year: number
}

type AppInfo = {
  name: string
  headerImage?: string
}

const steamHeaders = {
  'User-Agent': 'Mozilla/5.0',
  'Accept-Language': 'en',
  Cookie: 'birthtime=0; wants_mature_content=1; lastagecheckage=1-January-1990',
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolveSleep) => {
    setTimeout(resolveSleep, ms)
  })
}

function decodeHtml(value: string): string {
  return value
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&#(\d+);/g, (_, code: string) => String.fromCodePoint(Number(code)))
    .replace(/&#x([0-9a-f]+);/gi, (_, code: string) => String.fromCodePoint(Number.parseInt(code, 16)))
    .replace(/[ \t]+\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}

function parsePosted(text: string, currentYear: number): { postedOn: string; year: number } | null {
  const match = /Posted\s+(\d{1,2})\s+([A-Za-z]+)(?:,\s*(\d{4}))?/i.exec(text)
  if (!match) {
    return null
  }

  const day = Number(match[1])
  const month = MONTHS[match[2].toLowerCase()]
  const year = match[3] ? Number(match[3]) : currentYear
  if (!month || day < 1 || day > 31) {
    return null
  }

  const postedOn = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
  return { postedOn, year }
}

function parseReviewPage(html: string, currentYear: number): ParsedReview[] {
  const chunks = html.split('class="review_box"').slice(1)
  const reviews: ParsedReview[] = []

  for (const chunk of chunks) {
    const appMatch = /steamcommunity\.com\/app\/(\d+)/.exec(chunk)
    const titleMatch = /<div class="title">\s*<a [^>]*>([^<]+)<\/a>/.exec(chunk)
    const contentMatch = /<div class="content [^"]*">([\s\S]*?)<\/div>/.exec(chunk)
    const postedMatch = /<div class="posted">([\s\S]*?)<\/div>/.exec(chunk)
    if (!appMatch || !titleMatch || !contentMatch || !postedMatch) {
      continue
    }

    const posted = parsePosted(postedMatch[1], currentYear)
    if (!posted) {
      continue
    }

    reviews.push({
      steamAppId: Number(appMatch[1]),
      body: decodeHtml(contentMatch[1]),
      recommended: titleMatch[1].trim() === 'Recommended',
      postedOn: posted.postedOn,
      year: posted.year,
    })
  }

  return reviews
}

async function fetchText(url: string): Promise<string> {
  const response = await fetch(url, { headers: steamHeaders })
  if (!response.ok) {
    throw new Error(`Failed to fetch ${url} (${response.status})`)
  }
  return response.text()
}

async function fetchReviewsSince(minYear: number): Promise<ParsedReview[]> {
  const currentYear = new Date().getFullYear()
  const collected: ParsedReview[] = []

  for (let page = 1; page <= 40; page += 1) {
    const url = `${PROFILE_REVIEWS_URL}?p=${page}&l=english`
    const html = await fetchText(url)
    const pageReviews = parseReviewPage(html, currentYear)
    if (pageReviews.length === 0) {
      break
    }

    let reachedOlder = false
    for (const review of pageReviews) {
      if (review.year < minYear) {
        reachedOlder = true
        break
      }
      collected.push(review)
    }

    console.log(`Page ${page}: kept ${collected.length} reviews from ${minYear} onward`)
    if (reachedOlder) {
      break
    }

    await sleep(300)
  }

  return collected
}

async function fetchAppInfo(appId: number): Promise<AppInfo> {
  const url = `https://store.steampowered.com/api/appdetails?appids=${appId}&filters=basic`
  const response = await fetch(url, { headers: steamHeaders })
  if (!response.ok) {
    throw new Error(`Failed to load Steam app ${appId} (${response.status})`)
  }

  const payload = (await response.json()) as Record<string, { success?: boolean; data?: { name?: string; header_image?: string } }>
  const data = payload[String(appId)]?.data
  if (!payload[String(appId)]?.success || !data?.name) {
    throw new Error(`Steam did not return a title for app ${appId}`)
  }

  return { name: data.name, headerImage: data.header_image }
}

async function coverUrl(appId: number, headerImage?: string): Promise<string> {
  const library = `https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/${appId}/library_600x900.jpg`
  const response = await fetch(library, { method: 'HEAD', headers: steamHeaders })
  if (response.ok) {
    return library
  }
  if (headerImage) {
    return headerImage
  }
  return library
}

function slugify(title: string): string {
  const slug = title
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
  return slug || 'game'
}

function uniqueSlug(title: string, appId: number, used: Set<string>): string {
  const base = slugify(title)
  if (!used.has(base)) {
    used.add(base)
    return base
  }
  const withId = `${base}-${appId}`
  used.add(withId)
  return withId
}

async function main(): Promise<void> {
  const existing = JSON.parse(await readFile(reviewsPath, 'utf8')) as GameReview[]
  const manual = existing.filter((review) => !review.id.startsWith('steam-') && !review.id.startsWith('sample-'))
  const usedSlugs = new Set(manual.map((review) => review.slug))

  const ratings = new Map(
    existing.flatMap((review) =>
      review.steamAppId != null && review.rating != null ? [[review.steamAppId, review.rating] as const] : [],
    ),
  )

  const verdicts = new Map(
    existing.flatMap((review) =>
      review.steamAppId != null && review.verdict != null ? [[review.steamAppId, review.verdict] as const] : [],
    ),
  )

  const trailers = new Map(
    existing.flatMap((review) => {
      const trailer = review.trailer ?? review.trailerUrl
      return review.steamAppId != null && trailer != null ? [[review.steamAppId, trailer] as const] : []
    }),
  )

  const soundtracks = new Map(
    existing.flatMap((review) => {
      const soundtrack = review.soundtrack ?? review.soundtrackUrl
      return review.steamAppId != null && soundtrack != null ? [[review.steamAppId, soundtrack] as const] : []
    }),
  )

  const parsed = await fetchReviewsSince(MIN_YEAR)
  const imported: GameReview[] = []

  for (const review of parsed) {
    const app = await fetchAppInfo(review.steamAppId)
    const rating = ratings.get(review.steamAppId)
    const verdict = verdicts.get(review.steamAppId) ?? (review.recommended ? 'Recommended' : 'Not recommended')
    const trailer = trailers.get(review.steamAppId)
    const soundtrack = soundtracks.get(review.steamAppId)
    imported.push({
      id: `steam-${review.steamAppId}`,
      slug: uniqueSlug(app.name, review.steamAppId, usedSlugs),
      title: app.name,
      year: review.year,
      coverUrl: await coverUrl(review.steamAppId, app.headerImage),
      steamAppId: review.steamAppId,
      postedOn: review.postedOn,
      body: review.body,
      recommended: review.recommended,
      verdict,
      ...(rating != null ? { rating } : {}),
      ...(trailer != null ? { trailer } : {}),
      ...(soundtrack != null ? { soundtrack } : {}),
    })
    console.log(`${review.postedOn}  ${app.name}`)
    await sleep(200)
  }

  const reviews = [...imported, ...manual].sort((a, b) => {
    const aDate = a.postedOn ?? `${a.year}-01-01`
    const bDate = b.postedOn ?? `${b.year}-01-01`
    return bDate.localeCompare(aDate)
  })

  const site = JSON.parse(await readFile(sitePath, 'utf8')) as SiteConfig
  const years = new Set<number>(site.years)
  for (const review of reviews) {
    years.add(review.year)
  }
  site.years = [...years].sort((a, b) => a - b)

  await writeFile(reviewsPath, `${JSON.stringify(reviews, null, 2)}\n`)
  await writeFile(sitePath, `${JSON.stringify(site, null, 2)}\n`)
  console.log(`Wrote ${imported.length} Steam reviews. Kept ${manual.length} hand-written reviews.`)
}

await main()
