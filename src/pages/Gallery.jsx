import { useEffect, useMemo, useState } from 'react'
import SEO from '../components/SEO.jsx'
import Reveal from '../components/Reveal.jsx'
import Lightbox from '../components/Lightbox.jsx'
import Spinner from '../components/Spinner.jsx'
import Empty from '../components/Empty.jsx'
import { api } from '../services/api.js'
import { useSite } from '../context/SiteContext.jsx'

export default function Gallery() {
  const { site } = useSite()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [cat, setCat] = useState('All')
  const [lb, setLb] = useState(null)

  useEffect(() => {
    api.getGallery()
      .then(d => setItems(d.gallery || []))
      .finally(() => setLoading(false))
  }, [])

  const cats = useMemo(() => ['All', ...new Set(items.map(i => i.category).filter(Boolean))], [items])
  const list = useMemo(() => cat === 'All' ? items : items.filter(i => i.category === cat), [items, cat])

  return (
    <>
      <SEO
        title="Gallery — MJ Developers"
        description="Explore photos from our projects, construction sites and team."
        canonical={`${site?.settings?.siteUrl}/gallery`}
      />
      <section className="section" style={{ paddingTop: 140 }}>
        <div className="container">
          <span className="eyebrow">Gallery</span>
          <h1>Moments from our work.</h1>

          <div className="pills mt-4">
            {cats.map(c => (
              <button key={c} className={`pill ${cat === c ? 'active' : ''}`} onClick={() => setCat(c)}>{c}</button>
            ))}
          </div>

          {loading ? <Spinner /> : list.length === 0 ? (
            <Empty title="No images yet" />
          ) : (
            <div className="gallery-grid masonry">
              {list.map((g, i) => (
                <Reveal key={g.id} delay={i * 40}>
                  <div
                    className={`gallery-item ${i % 5 === 0 ? 'tall' : ''}`}
                    onClick={() => setLb({ src: g.url, alt: g.alt_text || g.title })}
                  >
                    <img src={g.url} alt={g.alt_text || g.title || ''} loading="lazy" />
                    {g.title && <span className="gallery-caption">{g.title}</span>}
                  </div>
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </section>
      {lb && <Lightbox src={lb.src} alt={lb.alt} onClose={() => setLb(null)} />}
    </>
  )
}
