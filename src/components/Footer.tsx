import type { SocialLink } from '../types'

type FooterProps = {
  socialLinks: SocialLink[]
}

export function Footer({ socialLinks }: FooterProps) {
  if (socialLinks.length === 0) {
    return null
  }

  return (
    <footer className="site-footer">
      <ul className="social-links">
        {socialLinks.map((link) => (
          <li key={`${link.label}-${link.url}`}>
            <a href={link.url} target="_blank" rel="noreferrer">
              {link.label}
            </a>
          </li>
        ))}
      </ul>
    </footer>
  )
}
