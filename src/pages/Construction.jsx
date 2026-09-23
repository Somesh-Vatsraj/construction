import { useEffect, useState } from 'react'
import SEO from '../components/SEO.jsx'
import Reveal from '../components/Reveal.jsx'
import Spinner from '../components/Spinner.jsx'
import { api } from '../services/api.js'
import { useSite } from '../context/SiteContext.jsx'

export default function Construction() {
  const { site } = useSite()
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const features = site?.features || []
  const content = site?.constructionContent || {}

  useEffect(() => {
    api.getProjects()
      .then(d => setProjects((d.projects || []).filter(p => p.published && p.status === 'Ongoing')))
      .finally(() => setLoading(false))
  }, [])

  return (
    <>
      <SEO
        title="Construction — MJ Developers"
        description="Explore our construction philosophy — quality materials, professional planning and timely execution."
        canonical={`${site?.settings?.siteUrl}/construction`}
      />
      <section className="section" style={{ paddingTop: 140 }}>
        <div className="container">
          <span className="eyebrow">Construction</span>
          <h1>{content.heading || 'Precision in every stage.'}</h1>
          <p className="lead mt-2">{content.intro}</p>

          <div className="grid grid-3 mt-4">
            {features.map((f, i) => (
              <Reveal key={i} delay={i * 80}>
                <div className="feature">
                  <div className="feature-icon">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M3 21h18M5 21V7l7-4 7 4v14"/></svg>
                  </div>
                  <h4>{f.title}</h4>
                  <p>{f.description}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {!loading && projects.length > 0 && (
        <section className="section" style={{ background: 'var(--surface-2)' }}>
          <div className="container">
            <Reveal className="section-head">
              <span className="eyebrow">Live Progress</span>
              <h2>Ongoing construction, updated regularly.</h2>
            </Reveal>
            <div className="grid grid-2">
              {projects.map(p => (
                <div key={p.id} className="card">
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
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  )
}
