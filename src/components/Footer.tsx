import type { SocialLink } from '../types'

type FooterProps = {
  socialLinks: SocialLink[]
}

export function Footer({ socialLinks }: FooterProps) {
  return (
    <footer className="site-footer">
      <p className="footer-mark">LimeLaze</p>
      {socialLinks.length > 0 && (
        <ul className="social-links">
          {socialLinks.map((link) => (
            <li key={`${link.label}-${link.url}`}>
              <a href={link.url} rel="noreferrer">
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      )}
    </footer>
  )
}
