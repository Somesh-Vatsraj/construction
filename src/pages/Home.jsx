import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import SEO from '../components/SEO.jsx'
import Reveal from '../components/Reveal.jsx'
import ProjectCard from '../components/ProjectCard.jsx'
import { useSite } from '../context/SiteContext.jsx'
import { api } from '../services/api.js'
import Spinner from '../components/Spinner.jsx'

export default function Home() {
  const { site, loading } = useSite()
  const [projects, setProjects] = useState([])
  const [amenities, setAmenities] = useState([])
  const [testimonials, setTestimonials] = useState([])

  useEffect(() => {
    api.getProjects().then(d => setProjects(d.projects || [])).catch(() => {})
    api.getAmenities().then(d => setAmenities(d.amenities || [])).catch(() => {})
    api.getTestimonials().then(d => setTestimonials(d.testimonials || [])).catch(() => {})
  }, [])

  if (loading || !site) return <Spinner label="Preparing your experience…" />

  const h = site.homepage || {}
  const stats = site.stats || {}
  const about = site.about || {}
  const owner = site.owner || {}
  const team = site.team || {}
  const construction = site.constructionContent || {}
  const features = site.features || []
  const cta = site.cta || {}
  const contact = site.contact || {}
  const featured = projects.filter(p => p.featured && p.published).slice(0, 3)
  const ongoing = projects.filter(p => p.published && p.status === 'Ongoing')

  return (
    <>
      <SEO
        title={site.seo?.homeTitle || 'MJ Developers — Premium Residential Apartments'}
        description={site.seo?.homeDescription || 'Premium residential spaces designed with quality, comfort and modern living in mind.'}
        canonical={`${site.settings?.siteUrl || ''}/`}
        image={h.heroImage}
        structuredData={{
          '@context': 'https://schema.org',
          '@type': 'Organization',
          name: 'MJ Developers',
          url: site.settings?.siteUrl,
          logo: site.settings?.logo,
          contactPoint: contact.phone ? [{
            '@type': 'ContactPoint',
            telephone: contact.phone,
            contactType: 'sales'
          }] : undefined
        }}
      />

      {/* HERO */}
      <section className="hero">
        <div className="hero-bg" style={{ backgroundImage: `url(${h.heroImage || ''})` }} />
        <div className="container hero-inner">
          <span className="eyebrow" style={{ color: 'var(--gold-2)' }}>
            {h.heroEyebrow || 'Premium Residential Developer'}
          </span>
          <h1>{h.heroHeading || 'Building Spaces. Creating Better Futures.'}</h1>
          <p className="hero-sub">
            {h.heroDescription || 'Premium residential spaces designed with quality, comfort and modern living in mind.'}
          </p>
          <div className="hero-actions">
            <Link to={h.primaryBtnLink || '/projects'} className="btn btn-gold">
              {h.primaryBtnText || 'Explore Projects'}
            </Link>
            <Link to={h.secondaryBtnLink || '/contact'} className="btn btn-outline">
              {h.secondaryBtnText || 'Schedule a Site Visit'}
            </Link>
          </div>

          <div className="hero-stats">
            {[
              ['Projects Delivered', stats.delivered],
              ['Ongoing Projects', stats.ongoing],
              ['Years of Experience', stats.years],
              ['Happy Families', stats.families]
            ].map(([label, val]) => (
              <div key={label}>
                <div className="hero-stat-num">{val ?? '—'}</div>
                <span className="hero-stat-label">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section className="section">
        <div className="container split">
          <Reveal className="split-img landscape">
            {about.image && <img src={about.image} alt="About MJ Developers" loading="lazy" />}
          </Reveal>
          <Reveal delay={120}>
            <span className="eyebrow">About MJ Developers</span>
            <h2>{about.heading || 'Built on quality. Guided by trust.'}</h2>
            <p className="lead">{about.description}</p>
            <Link to="/about" className="btn btn-primary mt-2">Read More</Link>
          </Reveal>
        </div>
      </section>

      {/* FEATURED PROJECTS */}
      <section className="section" style={{ background: 'var(--surface-2)' }}>
        <div className="container">
          <Reveal className="section-head">
            <span className="eyebrow">Featured Projects</span>
            <h2>Thoughtfully designed spaces<br/>you'll be proud to call home.</h2>
          </Reveal>
          {featured.length === 0 ? (
            <div className="empty">No featured projects yet. Add them from the admin panel.</div>
          ) : (
            <div className="grid grid-3">
              {featured.map((p, i) => (
                <Reveal key={p.id} delay={i * 90}>
                  <ProjectCard project={p} />
                </Reveal>
              ))}
            </div>
          )}
          <div className="text-center mt-4">
            <Link to="/projects" className="btn btn-outline">View All Projects</Link>
          </div>
        </div>
      </section>

      {/* OWNER */}
      {owner.name && (
        <section className="section">
          <div className="container owner-card">
            <Reveal className="owner-photo">
              {owner.photo && <img src={owner.photo} alt={owner.name} loading="lazy" />}
            </Reveal>
            <Reveal delay={120}>
              <span className="eyebrow">Leadership</span>
              <blockquote className="owner-quote">"{owner.message}"</blockquote>
              <div className="owner-name">{owner.name}</div>
              <div className="owner-title">{owner.designation}</div>
            </Reveal>
          </div>
        </section>
      )}

      {/* TEAM */}
      {team.photo && (
        <section className="section" style={{ background: 'var(--surface-2)' }}>
          <div className="container">
            <Reveal className="section-head center">
              <span className="eyebrow">Meet Our Team</span>
              <h2>{team.caption || 'Driven by people. Built on trust.'}</h2>
            </Reveal>
            <Reveal className="team-photo">
              <img src={team.photo} alt="MJ Developers team" loading="lazy" />
            </Reveal>
            <Reveal delay={100}>
              <p className="lead" style={{ margin: '0 auto', textAlign: 'center' }}>{team.description}</p>
            </Reveal>
          </div>
        </section>
      )}

      {/* CONSTRUCTION EXCELLENCE */}
      {features.length > 0 && (
        <section className="section">
          <div className="container">
            <Reveal className="section-head">
              <span className="eyebrow">Construction Excellence</span>
              <h2>Every detail, engineered with intention.</h2>
              <p className="lead">{construction.intro}</p>
            </Reveal>
            <div className="grid grid-3">
              {features.map((f, i) => (
                <Reveal key={f.id || i} delay={i * 80}>
                  <div className="feature">
                    <div className="feature-icon" aria-hidden="true">
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M3 21h18M5 21V7l7-4 7 4v14M9 9h.01M9 13h.01M9 17h.01M15 9h.01M15 13h.01M15 17h.01"/></svg>
                    </div>
                    <h4>{f.title}</h4>
                    <p>{f.description}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ONGOING PROJECTS */}
      {ongoing.length > 0 && (
        <section className="section" style={{ background: 'var(--surface-2)' }}>
          <div className="container">
            <Reveal className="section-head">
              <span className="eyebrow">In Progress</span>
              <h2>Ongoing construction, live from our sites.</h2>
            </Reveal>
            <div className="grid grid-3">
              {ongoing.map((p, i) => (
                <Reveal key={p.id} delay={i * 90}>
                  <div className="card">
                    <div className="project-card-img">
                      {p.main_image && <img src={p.main_image} alt={p.name} loading="lazy" />}
                    </div>
                    <div style={{ padding: 24 }}>
                      <h3 style={{ fontSize: '1.2rem', marginBottom: 6 }}>{p.name}</h3>
                      <p style={{ fontSize: 14, marginBottom: 12 }}>{p.location}</p>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: 'var(--ink-3)' }}>
                        <span>{p.construction_status || 'In progress'}</span>
                        <span>{p.progress || 0}%</span>
                      </div>
                      <div className="progress"><div className="progress-bar" style={{ width: `${p.progress || 0}%` }} /></div>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* AMENITIES */}
      {amenities.length > 0 && (
        <section className="section">
          <div className="container">
            <Reveal className="section-head">
              <span className="eyebrow">Amenities</span>
              <h2>Lifestyle, elevated.</h2>
            </Reveal>
            <div className="grid grid-3">
              {amenities.slice(0, 6).map((a, i) => (
                <Reveal key={a.id} delay={i * 70}>
                  <div className="amenity">
                    <div className="amenity-icon" aria-hidden="true">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M20 12v6a2 2 0 01-2 2H6a2 2 0 01-2-2v-6M2 8h20l-2-4H4L2 8zM12 8v12"/></svg>
                    </div>
                    <div>
                      <h4>{a.name}</h4>
                      <p>{a.description}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* TESTIMONIALS */}
      {testimonials.length > 0 && (
        <section className="section" style={{ background: 'var(--surface-2)' }}>
          <div className="container">
            <Reveal className="section-head">
              <span className="eyebrow">Testimonials</span>
              <h2>Trusted by families who now call us home.</h2>
            </Reveal>
            <div className="grid grid-3">
              {testimonials.filter(t => t.enabled).slice(0, 3).map((t, i) => (
                <Reveal key={t.id} delay={i * 90}>
                  <div className="testimonial">
                    <div className="testimonial-mark">"</div>
                    <p className="testimonial-text">{t.review}</p>
                    <div className="testimonial-meta">
                      {t.photo && (
                        <div className="testimonial-photo">
                          <img src={t.photo} alt={t.name} loading="lazy" />
                        </div>
                      )}
                      <div>
                        <div className="testimonial-name">{t.name}</div>
                        {t.project && <div className="testimonial-role">{t.project}</div>}
                      </div>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="cta" style={{ backgroundImage: `url(${cta.backgroundImage || ''})` }}>
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <Reveal>
            <span className="eyebrow" style={{ color: 'var(--gold-2)' }}>Get in touch</span>
            <h2>{cta.heading || "Let's Build Your Future Together"}</h2>
            <p className="lead">{cta.description}</p>
            <div className="cta-actions">
              <Link to="/contact" className="btn btn-gold">{cta.primaryBtnText || 'Schedule a Site Visit'}</Link>
              <Link to="/contact" className="btn btn-outline">{cta.secondaryBtnText || 'Contact Us'}</Link>
              {contact.whatsapp && (
                <a
                  className="btn btn-outline"
                  href={`https://wa.me/${String(contact.whatsapp).replace(/\D/g, '')}`}
                  target="_blank" rel="noreferrer noopener"
                >
                  WhatsApp
                </a>
              )}
            </div>
          </Reveal>
        </div>
      </section>
    </>
  )
}
