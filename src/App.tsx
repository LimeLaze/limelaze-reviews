import { Link, Outlet } from 'react-router-dom'
import { Footer } from './components/Footer'
import { YearNav } from './components/YearNav'
import { useSiteData } from './hooks/useSiteData'

export default function App() {
  const { data, error } = useSiteData()

  return (
    <div className="app-shell">
      <header className="site-header">
        <Link className="site-title" to="/">
          Lime's Den of Reviews
        </Link>
        {data && <YearNav years={data.site.years} />}
      </header>
      <main id="main" className="site-main">
        {error && <p className="load-error">{error}</p>}
        {!data && !error && <p className="loading">Loading reviews…</p>}
        {data && <Outlet context={data} />}
      </main>
      {data && <Footer socialLinks={data.site.socialLinks} />}
    </div>
  )
}
