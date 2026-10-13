import { useEffect, useState } from 'react'
import type { Top20Data, Top20Game } from '../types'

function resolveAssetUrl(url: string): string {
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url
  }
  const base = import.meta.env.BASE_URL.replace(/\/$/, '')
  const cleanPath = url.replace(/^\//, '')
  return base ? `${base}/${cleanPath}` : `/${cleanPath}`
}

export function Top20Page() {
  const [comments, setComments] = useState<string | null>(null)
  const [games, setGames] = useState<Top20Game[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    const base = import.meta.env.BASE_URL.replace(/\/$/, '')
    const url = `${base}/data/top20.json`

    fetch(url)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Failed to load top 20 data (${res.status})`)
        }
        return res.json() as Promise<Top20Game[] | Top20Data>
      })
      .then((data) => {
        if (!cancelled) {
          if (Array.isArray(data)) {
            setGames(data)
            setComments(null)
          } else {
            setGames(data.games ?? [])
            setComments(data.comments ?? data.intro ?? null)
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

  if (loading) {
    return <p className="loading">Loading top 20 games…</p>
  }

  if (error) {
    return <p className="load-error">{error}</p>
  }

  return (
    <section className="top20-page">
      <h1 className="page-title">My Top 20 Games of All Time</h1>
      {comments && (
        <div className="top20-intro">
          <p className="top20-intro-text">{comments}</p>
        </div>
      )}
      <ol className="top20-list">
        {games.map((game) => (
          <li key={game.rank} className="top20-item">
            <div className="top20-cover-wrap">
              <img
                src={resolveAssetUrl(game.coverUrl)}
                alt={game.title === 'Type here' ? `Rank #${game.rank}` : game.title}
                className="top20-cover"
                loading="lazy"
                width={160}
                height={240}
              />
              <span className="top20-rank">#{game.rank}</span>
            </div>
            <div className="top20-info">
              <h2 className="top20-title">{game.title}</h2>
              <p className="top20-description">{game.description}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  )
}
