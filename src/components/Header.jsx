import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { useSite } from '../context/SiteContext.jsx'

const links = [
  { to: '/', label: 'Home', end: true },
  { to: '/projects', label: 'Projects' },
  { to: '/about', label: 'About' },
  { to: '/construction', label: 'Construction' },
  { to: '/amenities', label: 'Amenities' },
  { to: '/gallery', label: 'Gallery' },
  { to: '/contact', label: 'Contact' }
]

export default function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()
  const { site } = useSite()

  const isHome = pathname === '/'
  const isTransparent = isHome && !scrolled

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => { setOpen(false) }, [pathname])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  return (
    <>
      <header
        className={`header ${scrolled ? 'scrolled' : ''} ${isTransparent ? 'on-hero' : ''}`}
      >
        <div className="container header-inner">
          <Link to="/" className="brand" aria-label="MJ Developers home">
            <span className="brand-mark">MJ</span>
            <span>MJ Developers</span>
          </Link>

          <nav className="nav" aria-label="Primary">
            {links.map(l => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.end}
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              >
                {l.label}
              </NavLink>
            ))}
          </nav>

          <div className="header-cta">
            <Link to="/contact" className="btn btn-outline btn-sm">Enquire Now</Link>
          </div>

          <button
            className={`nav-toggle ${open ? 'open' : ''}`}
            onClick={() => setOpen(!open)}
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
          >
            <span />
          </button>
        </div>
      </header>

      <nav className={`mobile-nav ${open ? 'open' : ''}`} aria-label="Mobile">
        {links.map(l => (
          <NavLink key={l.to} to={l.to} end={l.end}>
            {l.label}
          </NavLink>
        ))}
        <Link to="/contact" style={{ borderBottom: 'none', color: 'var(--gold-3)' }}>
          Enquire Now →
        </Link>
      </nav>
    </>
  )
}
