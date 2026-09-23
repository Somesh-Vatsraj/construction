import { Link } from 'react-router-dom'
import { useSite } from '../context/SiteContext.jsx'

const SocialIcons = {
  instagram: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor"/></svg>,
  facebook: <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M14 9h3V6h-3c-2.2 0-4 1.8-4 4v2H8v3h2v7h3v-7h3l1-3h-4v-2c0-.6.4-1 1-1z"/></svg>,
  youtube: <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M22 12s0-3-.4-4.5c-.2-.8-.8-1.4-1.6-1.6C18.4 5.5 12 5.5 12 5.5s-6.4 0-8 .4c-.8.2-1.4.8-1.6 1.6C2 9 2 12 2 12s0 3 .4 4.5c.2.8.8 1.4 1.6 1.6 1.6.4 8 .4 8 .4s6.4 0 8-.4c.8-.2 1.4-.8 1.6-1.6.4-1.5.4-4.5.4-4.5zM10 15V9l5 3-5 3z"/></svg>,
  linkedin: <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M4.98 3.5a2.5 2.5 0 100 5 2.5 2.5 0 000-5zM3 9h4v12H3V9zm7 0h3.8v1.7h.05c.53-.95 1.8-1.95 3.7-1.95 3.95 0 4.45 2.5 4.45 5.75V21H18v-5.5c0-1.3-.02-3-1.85-3-1.85 0-2.15 1.42-2.15 2.9V21h-4V9z"/></svg>,
  twitter: <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M18 3h3l-7 8 8 10h-6l-5-6-6 6H2l8-9L2 3h6l4 5 6-5z"/></svg>
}

export default function Footer() {
  const { site } = useSite()
  const c = site?.contact || {}
  const social = c.social || {}
  const year = new Date().getFullYear()

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <div className="footer-brand">
              <span className="brand-mark">MJ</span>
              <span>MJ Developers</span>
            </div>
            <p className="footer-desc">
              {site?.settings?.footerDescription ||
                'Building premium residential spaces with quality construction, thoughtful design and comfortable modern living.'}
            </p>
            <div className="social-row">
              {Object.entries(social).map(([k, url]) =>
                url && SocialIcons[k] ? (
                  <a key={k} href={url} target="_blank" rel="noreferrer noopener" aria-label={k}>
                    {SocialIcons[k]}
                  </a>
                ) : null
              )}
            </div>
          </div>

          <div>
            <h5>Explore</h5>
            <ul className="footer-links">
              <li><Link to="/projects">Projects</Link></li>
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/construction">Construction</Link></li>
              <li><Link to="/amenities">Amenities</Link></li>
              <li><Link to="/gallery">Gallery</Link></li>
            </ul>
          </div>

          <div>
            <h5>Company</h5>
            <ul className="footer-links">
              <li><Link to="/contact">Contact</Link></li>
              <li><Link to="/privacy">Privacy Policy</Link></li>
              <li><Link to="/terms">Terms & Conditions</Link></li>
            </ul>
          </div>

          <div>
            <h5>Contact</h5>
            <ul className="footer-links">
              {c.address && <li>{c.address}</li>}
              {c.phone && <li><a href={`tel:${c.phone}`}>{c.phone}</a></li>}
              {c.email && <li><a href={`mailto:${c.email}`}>{c.email}</a></li>}
              {c.hours && <li>{c.hours}</li>}
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <span>© {year} MJ Developers. All rights reserved.</span>
          <span>Designed & built with care.</span>
        </div>
      </div>
    </footer>
  )
}
