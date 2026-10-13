import { useEffect, useRef, useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'

type HeaderNavProps = {
  years: number[]
}

export function HeaderNav({ years }: HeaderNavProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const location = useLocation()

  const ordered = [...years].sort((a, b) => a - b)
  const isYearActive = /^\/\d{4}/.test(location.pathname)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false)
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  const handleLinkClick = () => {
    setDropdownOpen(false)
  }

  return (
    <nav className="site-nav" aria-label="Main navigation">
      <div
        className={`nav-dropdown ${dropdownOpen ? 'is-open' : ''}`}
        ref={dropdownRef}
        onMouseEnter={() => setDropdownOpen(true)}
        onMouseLeave={() => setDropdownOpen(false)}
      >
        <button
          type="button"
          className={`nav-dropdown-trigger ${isYearActive ? 'is-active' : ''}`}
          aria-expanded={dropdownOpen}
          aria-haspopup="true"
          onClick={() => setDropdownOpen((prev) => !prev)}
        >
          <span>Reviews by Year</span>
          <svg
            className="dropdown-caret"
            viewBox="0 0 10 6"
            width="10"
            height="6"
            aria-hidden="true"
          >
            <path
              d="M1 1L5 5L9 1"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
          </svg>
        </button>

        <ul className="nav-dropdown-menu" role="menu">
          {ordered.map((year) => (
            <li key={year} role="none">
              <NavLink
                to={`/${year}`}
                role="menuitem"
                className={({ isActive }) =>
                  isActive ? 'dropdown-link is-active' : 'dropdown-link'
                }
                onClick={handleLinkClick}
              >
                {year}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>

      <NavLink
        to="/top-20"
        className={({ isActive }) =>
          isActive ? 'nav-link is-active' : 'nav-link'
        }
        onClick={handleLinkClick}
      >
        My Top 20 Games of All Time
      </NavLink>

      {/* "About Me" link hidden for now — code and page are preserved in src/pages/AboutPage.tsx
      <NavLink
        to="/about"
        className={({ isActive }) =>
          isActive ? 'nav-link is-active' : 'nav-link'
        }
        onClick={handleLinkClick}
      >
        About Me
      </NavLink>
      */}
    </nav>
  )
}
