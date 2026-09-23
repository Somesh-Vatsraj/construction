import { useEffect, useState } from 'react'
import SEO from '../components/SEO.jsx'
import Reveal from '../components/Reveal.jsx'
import Spinner from '../components/Spinner.jsx'
import Empty from '../components/Empty.jsx'
import { api } from '../services/api.js'
import { useSite } from '../context/SiteContext.jsx'

export default function Amenities() {
  const { site } = useSite()
  const [amenities, setAmenities] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.getAmenities()
      .then(d => setAmenities(d.amenities || []))
      .finally(() => setLoading(false))
  }, [])

  return (
    <>
      <SEO
        title="Amenities — MJ Developers"
        description="Discover the amenities that make MJ Developers residences truly comfortable."
        canonical={`${site?.settings?.siteUrl}/amenities`}
      />
      <section className="section" style={{ paddingTop: 140 }}>
        <div className="container">
          <span className="eyebrow">Amenities</span>
          <h1>Everything you need,<br/>right at home.</h1>
          {loading ? <Spinner /> : amenities.length === 0 ? (
            <Empty title="Amenities coming soon" />
          ) : (
            <div className="grid grid-3 mt-4">
              {amenities.map((a, i) => (
                <Reveal key={a.id} delay={i * 60}>
                  <div className="amenity">
                    <div className="amenity-icon" aria-hidden="true">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M20 12v6a2 2 0 01-2 2H6a2 2 0 01-2-2v-6M2 8h20l-2-4H4L2 8z"/></svg>
                    </div>
                    <div>
                      <h4>{a.name}</h4>
                      <p>{a.description}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  )
}
