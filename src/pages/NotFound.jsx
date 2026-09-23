import { Link } from 'react-router-dom'
import SEO from '../components/SEO.jsx'

export default function NotFound() {
  return (
    <>
      <SEO title="Page not found — MJ Developers" />
      <section className="section" style={{ paddingTop: 160, textAlign: 'center', minHeight: '70vh' }}>
        <div className="container-narrow">
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(4rem, 12vw, 8rem)', color: 'var(--gold-2)', lineHeight: 1 }}>404</div>
          <h1 className="mt-2">We couldn't find that page.</h1>
          <p className="lead" style={{ margin: '0 auto' }}>The page you're looking for may have moved or no longer exists.</p>
          <div className="mt-4">
            <Link to="/" className="btn btn-primary">Back to Home</Link>
          </div>
        </div>
      </section>
    </>
  )
}
