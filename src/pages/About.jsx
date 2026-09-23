import SEO from '../components/SEO.jsx'
import Reveal from '../components/Reveal.jsx'
import { useSite } from '../context/SiteContext.jsx'
import Spinner from '../components/Spinner.jsx'

export default function About() {
  const { site, loading } = useSite()
  if (loading) return <Spinner />
  const a = site?.about || {}
  const owner = site?.owner || {}
  const team = site?.team || {}

  return (
    <>
      <SEO title="About Us — MJ Developers" description={a.description} canonical={`${site?.settings?.siteUrl}/about`} />
      <section className="section" style={{ paddingTop: 140 }}>
        <div className="container">
          <span className="eyebrow">About Us</span>
          <h1>{a.heading || 'Built on quality. Guided by trust.'}</h1>
          {a.image && (
            <Reveal className="split-img landscape mt-4">
              <img src={a.image} alt="About MJ Developers" loading="lazy" />
            </Reveal>
          )}
          <Reveal className="mt-4">
            <p className="lead" style={{ whiteSpace: 'pre-line' }}>{a.fullDescription || a.description}</p>
          </Reveal>
        </div>
      </section>

      {owner.name && (
        <section className="section" style={{ background: 'var(--surface-2)' }}>
          <div className="container owner-card">
            <Reveal className="owner-photo">
              {owner.photo && <img src={owner.photo} alt={owner.name} loading="lazy" />}
            </Reveal>
            <Reveal delay={100}>
              <span className="eyebrow">Leadership</span>
              <blockquote className="owner-quote">"{owner.message}"</blockquote>
              <div className="owner-name">{owner.name}</div>
              <div className="owner-title">{owner.designation}</div>
            </Reveal>
          </div>
        </section>
      )}

      {team.photo && (
        <section className="section">
          <div className="container">
            <Reveal className="section-head center">
              <span className="eyebrow">Meet Our Team</span>
              <h2>{team.caption}</h2>
            </Reveal>
            <Reveal className="team-photo">
              <img src={team.photo} alt="Our team" loading="lazy" />
            </Reveal>
            <Reveal delay={100}>
              <p className="lead" style={{ margin: '0 auto', textAlign: 'center' }}>{team.description}</p>
            </Reveal>
          </div>
        </section>
      )}
    </>
  )
}
