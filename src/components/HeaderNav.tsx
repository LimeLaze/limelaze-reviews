import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { NavLink, useLocation } from 'react-router-dom'

type HeaderNavProps = {
  years: number[]
}

export function HeaderNav({ years }: HeaderNavProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [menuCoords, setMenuCoords] = useState<{ top: number; left: number } | null>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const menuRef = useRef<HTMLUListElement>(null)
  const navRef = useRef<HTMLElement>(null)
  const closeTimerRef = useRef<number | null>(null)
  const location = useLocation()

  const ordered = [...years].sort((a, b) => a - b)
  const isYearActive = /^\/\d{4}/.test(location.pathname)

  const updatePosition = () => {
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect()
      const minLeft = 12
      const maxLeft = Math.max(minLeft, window.innerWidth - 170)
      const left = Math.max(minLeft, Math.min(rect.left, maxLeft))
      setMenuCoords({
        top: rect.bottom + 6,
        left,
      })
    }
  }

  const openDropdown = () => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current)
      closeTimerRef.current = null
    }
    updatePosition()
    setDropdownOpen(true)
  }

  const closeDropdown = () => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current)
      closeTimerRef.current = null
    }
    setDropdownOpen(false)
  }

  const scheduleClose = () => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current)
    }
    closeTimerRef.current = window.setTimeout(() => {
      setDropdownOpen(false)
    }, 140)
  }

  const handleTriggerClick = () => {
    if (dropdownOpen) {
      closeDropdown()
    } else {
      openDropdown()
    }
  }

  const handleLinkClick = () => {
    closeDropdown()
  }

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(target) &&
        menuRef.current &&
        !menuRef.current.contains(target)
      ) {
        closeDropdown()
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        closeDropdown()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  useEffect(() => {
    if (!dropdownOpen) return

    updatePosition()

    const handleScrollOrResize = () => {
      updatePosition()
    }

    window.addEventListener('scroll', handleScrollOrResize, true)
    window.addEventListener('resize', handleScrollOrResize)
    return () => {
      window.removeEventListener('scroll', handleScrollOrResize, true)
      window.removeEventListener('resize', handleScrollOrResize)
    }
  }, [dropdownOpen])

  useEffect(() => {
    if (navRef.current) {
      const activeEl = navRef.current.querySelector('.is-active') as HTMLElement | null
      if (activeEl) {
        const container = navRef.current
        const activeLeft = activeEl.offsetLeft
        const activeWidth = activeEl.offsetWidth
        const containerWidth = container.clientWidth
        const targetScrollLeft = activeLeft - containerWidth / 2 + activeWidth / 2
        container.scrollTo({ left: Math.max(0, targetScrollLeft), behavior: 'smooth' })
      }
    }
  }, [location.pathname])

  return (
    <div className="site-nav-container">
      <nav ref={navRef} className="site-nav" aria-label="Main navigation">
        <div
          className={`nav-dropdown ${dropdownOpen ? 'is-open' : ''}`}
          ref={dropdownRef}
          onMouseEnter={openDropdown}
          onMouseLeave={scheduleClose}
        >
          <button
            ref={triggerRef}
            type="button"
            className={`nav-dropdown-trigger ${isYearActive ? 'is-active' : ''}`}
            aria-expanded={dropdownOpen}
            aria-haspopup="true"
            onClick={handleTriggerClick}
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

        <NavLink
          to="/every-game"
          className={({ isActive }) =>
            isActive ? 'nav-link is-active' : 'nav-link'
          }
          onClick={handleLinkClick}
        >
          Every Game I've Beaten
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

      {dropdownOpen &&
        menuCoords &&
        createPortal(
          <ul
            ref={menuRef}
            className="nav-dropdown-menu is-open"
            role="menu"
            style={{
              position: 'fixed',
              top: `${menuCoords.top}px`,
              left: `${menuCoords.left}px`,
            }}
            onMouseEnter={openDropdown}
            onMouseLeave={scheduleClose}
          >
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
          </ul>,
          document.body,
        )}
    </div>
  )
}
