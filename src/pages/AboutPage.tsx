import { useEffect, useState } from 'react'
import type { AboutData } from '../types'

export function AboutPage() {
  const [about, setAbout] = useState<AboutData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    const base = import.meta.env.BASE_URL.replace(/\/$/, '')
    const url = `${base}/data/about.json`

    fetch(url)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Failed to load about data (${res.status})`)
        }
        return res.json() as Promise<AboutData>
      })
      .then((data) => {
        if (!cancelled) {
          setAbout(data)
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
    return <p className="loading">Loading about page…</p>
  }

  if (error) {
    return <p className="load-error">{error}</p>
  }

  return (
    <section className="about-page">
      <h1 className="page-title">{about?.title ?? 'About Me'}</h1>
      <div className="about-card">
        <p className="about-content">{about?.content ?? 'Type here'}</p>
      </div>
    </section>
  )
}
