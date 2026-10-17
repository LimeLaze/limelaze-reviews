import { useEffect, useMemo, useState } from 'react'
import type { EveryGameData } from '../types'

function cleanString(str: string): string {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '')
}

/**
 * Checks if the characters of query appear in target in the corresponding order,
 * ignoring whitespace, casing, accents, and special symbols.
 */
function matchesFuzzy(query: string, target: string): boolean {
  const cleanQ = cleanString(query)
  if (!cleanQ) {
    return true
  }
  const cleanT = cleanString(target)
  let qIdx = 0
  for (let tIdx = 0; tIdx < cleanT.length && qIdx < cleanQ.length; tIdx++) {
    if (cleanT[tIdx] === cleanQ[qIdx]) {
      qIdx++
    }
  }
  return qIdx === cleanQ.length
}

export function EveryGamePage() {
  const [games, setGames] = useState<string[]>([])
  const [title, setTitle] = useState("Every Game I've Played")
  const [description, setDescription] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    const base = import.meta.env.BASE_URL.replace(/\/$/, '')
    const url = `${base}/data/every-game.json`

    fetch(url)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Failed to load games list (${res.status})`)
        }
        return res.json() as Promise<EveryGameData | string[]>
      })
      .then((data) => {
        if (!cancelled) {
          if (Array.isArray(data)) {
            setGames(data)
          } else if (data && Array.isArray(data.games)) {
            setGames(data.games)
            if (data.title) {
              setTitle(data.title)
            }
            if (typeof data.description === 'string') {
              setDescription(data.description)
            }
          }
          setLoading(false)
        }
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Unknown error')
          setLoading(false)
        }
      })

    return () => {
      cancelled = true
    }
  }, [])

  // Always keep list sorted in alphabetical order (A-Z)
  const sortedGames = useMemo(() => {
    return [...games].sort((a, b) =>
      a.localeCompare(b, undefined, { sensitivity: 'base', numeric: true }),
    )
  }, [games])

  // Live filter based on fuzzy sequence search
  const filteredGames = useMemo(() => {
    if (!searchQuery.trim()) {
      return sortedGames
    }
    return sortedGames.filter((game) => matchesFuzzy(searchQuery, game))
  }, [sortedGames, searchQuery])

  if (loading) {
    return <p className="loading">Loading games list…</p>
  }

  if (error) {
    return <p className="load-error">{error}</p>
  }

  const isFiltering = searchQuery.trim().length > 0

  return (
    <section className="every-game-page">
      <h1 className="page-title">{title}</h1>

      {description && <p className="every-game-description">{description}</p>}

      <div className="every-game-controls">
        <div className="search-bar-wrap">
          <svg
            className="search-icon"
            viewBox="0 0 20 20"
            width="18"
            height="18"
            aria-hidden="true"
          >
            <path
              d="M8.5 3a5.5 5.5 0 0 1 4.38 8.82l4.15 4.15a.75.75 0 0 1-1.06 1.06l-4.15-4.15A5.5 5.5 0 1 1 8.5 3zm0 1.5a4 4 0 1 0 0 8 4 4 0 0 0 0-8z"
              fill="currentColor"
            />
          </svg>
          <input
            type="text"
            className="every-game-search"
            placeholder="Search games…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            aria-label="Search games list"
          />
          {searchQuery && (
            <button
              type="button"
              className="search-clear-btn"
              onClick={() => setSearchQuery('')}
              aria-label="Clear search"
              title="Clear search"
            >
              ✕
            </button>
          )}
        </div>

        <p className="every-game-counter">
          {isFiltering
            ? `Showing ${filteredGames.length} of ${sortedGames.length} games`
            : `${sortedGames.length} games played`}
        </p>
      </div>

      {filteredGames.length === 0 ? (
        <div className="every-game-empty">
          <p className="empty-title">No games found</p>
          <p className="empty-subtitle">
            No games matching &ldquo;{searchQuery}&rdquo;. Try another search.
          </p>
        </div>
      ) : (
        <ul className="every-game-list">
          {filteredGames.map((game, index) => (
            <li key={`${game}-${index}`} className="every-game-item">
              <span className="every-game-bullet" aria-hidden="true">•</span>
              <span className="every-game-name">{game}</span>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
