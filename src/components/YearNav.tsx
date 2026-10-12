import { NavLink } from 'react-router-dom'

type YearNavProps = {
  years: number[]
}

export function YearNav({ years }: YearNavProps) {
  const ordered = [...years].sort((a, b) => a - b)

  return (
    <nav className="year-nav" aria-label="Review years">
      <ul>
        {ordered.map((year) => (
          <li key={year}>
            <NavLink
              to={`/${year}`}
              className={({ isActive }) =>
                isActive ? 'year-link is-active' : 'year-link'
              }
            >
              {year}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}
