import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import SEO from '../components/SEO.jsx'
import Spinner from '../components/Spinner.jsx'
import Lightbox from '../components/Lightbox.jsx'
import Reveal from '../components/Reveal.jsx'
import { api } from '../services/api.js'
import { useSite } from '../context/SiteContext.jsx'

export default function ProjectDetail() {
  const { slug } = useParams()
  const { site } = useSite()
  const [p, setP] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [lightbox, setLightbox] = useState(null)

  useEffect(() => {
    setLoading(true)
    api.getProject(slug)
      .then(d => setP(d.project))
      .catch(e => setError(e.message))
      .finally(() => setLoading(false))
  }, [slug])

  if (loading) return <div style={{ paddingTop: 160 }}><Spinner /></div>
  if (error || !p) return (
    <div className="container" style={{ paddingTop: 160, paddingBottom: 80 }}>
      <h1>Project not found</h1>
      <Link to="/projects" className="btn btn-primary mt-2">Back to Projects</Link>
    </div>
  )

  const gallery = p.gallery || []
  const floorPlans = p.floor_plans || []
  const specs = p.specifications || []
  const amenities = p.amenities || []
  const highlights = p.highlights || []

  return (
    <>
      <SEO
        title={p.seo_title || `${p.name} — MJ Developers`}
        description={p.seo_description || p.short_description}
        canonical={`${site?.settings?.siteUrl || ''}/projects/${p.slug}`}
        image={p.seo_og_image || p.main_image}
        type="article"
        structuredData={{
          '@context': 'https://schema.org',
          '@type': 'Residence',
          name: p.name,
          description: p.short_description,
          image: p.main_image,
          address: { '@type': 'PostalAddress', addressLocality: p.location }
        }}
      />

      {/* HERO */}
      <section className="pd-hero">
        <div className="pd-hero-bg" style={{ backgroundImage: `url(${p.main_image || ''})` }} />
        <div className="container">
          <nav className="breadcrumbs" aria-label="Breadcrumb" style={{ color: 'rgba(255,255,255,.65)' }}>
            <Link to="/">Home</Link>
            <span className="sep">/</span>
            <Link to="/projects">Projects</Link>
            <span className="sep">/</span>
            <span>{p.name}</span>
          </nav>
          <h1>{p.name}</h1>
          <div className="pd-meta">
            <div><span>Location</span><strong>{p.location}</strong></div>
            <div><span>Property Type</span><strong>{p.property_type || '—'}</strong></div>
            <div><span>Status</span><strong>{p.status}</strong></div>
            {p.starting_price && <div><span>Starting Price</span><strong>{p.starting_price}</strong></div>}
            {p.possession && <div><span>Possession</span><strong>{p.possession}</strong></div>}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container" style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 60 }}>
          {p.description && (
            <Reveal>
              <h2>Overview</h2>
              <p className="lead" style={{ whiteSpace: 'pre-line' }}>{p.description}</p>
            </Reveal>
          )}

          {highlights.length > 0 && (
            <Reveal>
              <h2>Key Highlights</h2>
              <ul className="spec-list">
                {highlights.map((h, i) => <li key={i}>{h}</li>)}
              </ul>
            </Reveal>
          )}

          {amenities.length > 0 && (
            <Reveal>
              <h2>Amenities</h2>
              <div className="grid grid-3">
                {amenities.map((a, i) => (
                  <div key={i} className="amenity">
                    <div className="amenity-icon" aria-hidden="true">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M20 12v6a2 2 0 01-2 2H6a2 2 0 01-2-2v-6M2 8h20l-2-4H4L2 8z"/></svg>
                    </div>
                    <div>
                      <h4>{typeof a === 'string' ? a : a.name}</h4>
                      {typeof a !== 'string' && <p>{a.description}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </Reveal>
          )}

          {gallery.length > 0 && (
            <Reveal>
              <h2>Gallery</h2>
              <div className="gallery-grid">
                {gallery.map((g, i) => (
                  <div
                    key={i}
                    className="gallery-item"
                    onClick={() => setLightbox({ src: g.url || g, alt: p.name })}
                  >
                    <img src={g.url || g} alt={g.alt || p.name} loading="lazy" />
                  </div>
                ))}
              </div>
            </Reveal>
          )}

          {floorPlans.length > 0 && (
            <Reveal>
              <h2>Floor Plans</h2>
              <div className="grid grid-2">
                {floorPlans.map((f, i) => (
                  <div key={i} className="card" style={{ padding: 24 }}>
                    <div
                      className="split-img landscape"
                      style={{ cursor: 'zoom-in' }}
                      onClick={() => setLightbox({ src: f.image, alt: f.title })}
                    >
                      <img src={f.image} alt={f.title} loading="lazy" />
                    </div>
                    <h3 style={{ marginTop: 18, fontSize: '1.15rem' }}>{f.title}</h3>
                    {f.area && <p style={{ fontSize: 13, color: 'var(--gold-3)', marginBottom: 6 }}>{f.area}</p>}
                    <p style={{ fontSize: 14, margin: 0 }}>{f.description}</p>
                  </div>
                ))}
              </div>
            </Reveal>
          )}

          {specs.length > 0 && (
            <Reveal>
              <h2>Specifications</h2>
              <ul className="spec-list">
                {specs.map((s, i) => <li key={i}>{typeof s === 'string' ? s : `${s.label}: ${s.value}`}</li>)}
              </ul>
            </Reveal>
          )}

          {p.progress > 0 && (
            <Reveal>
              <h2>Construction Progress</h2>
              <div style={{ maxWidth: 500 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14 }}>
                  <span>{p.construction_status || 'In progress'}</span>
                  <span>{p.progress}%</span>
                </div>
                <div className="progress"><div className="progress-bar" style={{ width: `${p.progress}%` }} /></div>
              </div>
            </Reveal>
          )}

          {p.map_embed && (
            <Reveal>
              <h2>Location</h2>
              <div className="map-embed" dangerouslySetInnerHTML={{ __html: p.map_embed }} />
            </Reveal>
          )}

          <Reveal>
            <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
              <Link to="/contact" className="btn btn-primary">Enquire About This Project</Link>
              <Link to="/contact" className="btn btn-outline">Schedule Site Visit</Link>
              {p.brochure_url && (
                <a href={p.brochure_url} target="_blank" rel="noreferrer noopener" className="btn btn-gold">
                  Download Brochure
                </a>
              )}
            </div>
          </Reveal>
        </div>
      </section>

      {lightbox && (
        <Lightbox
          src={lightbox.src}
          alt={lightbox.alt}
          onClose={() => setLightbox(null)}
        />
      )}
    </>
  )
}
