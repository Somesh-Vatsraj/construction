import { useEffect, useState } from 'react'
import { api } from '../../services/api.js'

const TABS = [
  { key: 'homepage', label: 'Homepage Hero' },
  { key: 'about', label: 'About' },
  { key: 'owner', label: 'Owner' },
  { key: 'team', label: 'Team' },
  { key: 'stats', label: 'Stats' },
  { key: 'features', label: 'Construction Features' },
  { key: 'constructionContent', label: 'Construction Page' },
  { key: 'cta', label: 'Final CTA' },
  { key: 'contact', label: 'Contact Info' },
  { key: 'seo', label: 'SEO' },
  { key: 'settings', label: 'Website Settings' }
]

export default function ContentAdmin() {
  const [tab, setTab] = useState('homepage')
  const [content, setContent] = useState({})
  const [loading, setLoading] = useState(true)
  const [msg, setMsg] = useState('')

  async function load() {
    setLoading(true)
    const d = await api.getContent()
    setContent(d.content || {})
    setLoading(false)
  }
  useEffect(() => { load() }, [])

  async function save(key, value) {
    try {
      await api.updateContent(key, value)
      setMsg(`${key} saved`)
      setTimeout(() => setMsg(''), 2000)
    } catch (e) { setMsg(e.message) }
  }

  if (loading) return <div>Loading…</div>

  const val = content[tab] || {}

  function update(k, v) {
    setContent({ ...content, [tab]: { ...val, [k]: v } })
  }

  async function uploadInto(key) {
    return async e => {
      const file = e.target.files?.[0]; if (!file) return
      const r = await api.upload(file, { category: tab })
      update(key, r.url)
    }
  }

  return (
    <>
      <div className="admin-head"><h1>Homepage & Content</h1></div>
      {msg && <div className="toast success">{msg}</div>}

      <div className="pills">
        {TABS.map(t => (
          <button key={t.key} className={`pill ${tab === t.key ? 'active' : ''}`} onClick={() => setTab(t.key)}>{t.label}</button>
        ))}
      </div>

      <div className="panel">
        <h3>{TABS.find(t => t.key === tab)?.label}</h3>
        <ContentFields section={tab} val={val} update={update} uploadInto={uploadInto} />
        <button className="btn btn-primary mt-3" onClick={() => save(tab, val)}>Save Changes</button>
      </div>
    </>
  )
}

function ContentFields({ section, val, update, uploadInto }) {
  const field = (k, label, type = 'text') => (
    <div className="field" key={k}>
      <label>{label}</label>
      {type === 'textarea' ? (
        <textarea value={val[k] || ''} onChange={e => update(k, e.target.value)} />
      ) : (
        <input value={val[k] || ''} onChange={e => update(k, e.target.value)} />
      )}
      {['image', 'photo', 'heroImage', 'backgroundImage', 'ogImage', 'logo'].includes(k) && (
        <>
          <input type="file" accept="image/*" onChange={uploadInto(k)} style={{ marginTop: 8 }} />
          {val[k] && <img src={val[k]} alt="" style={{ maxHeight: 120, marginTop: 8, borderRadius: 6 }} />}
        </>
      )}
    </div>
  )

  if (section === 'homepage') return (
    <>
      {field('heroEyebrow', 'Hero Eyebrow')}
      {field('heroHeading', 'Hero Heading')}
      {field('heroDescription', 'Hero Description', 'textarea')}
      {field('heroImage', 'Hero Background Image')}
      {field('primaryBtnText', 'Primary Button Text')}
      {field('primaryBtnLink', 'Primary Button Link')}
      {field('secondaryBtnText', 'Secondary Button Text')}
      {field('secondaryBtnLink', 'Secondary Button Link')}
    </>
  )

  if (section === 'about') return (
    <>
      {field('heading', 'Heading')}
      {field('description', 'Short Description', 'textarea')}
      {field('fullDescription', 'Full Description', 'textarea')}
      {field('image', 'Image')}
    </>
  )

  if (section === 'owner') return (
    <>
      {field('name', 'Name')}
      {field('designation', 'Designation')}
      {field('message', 'Message', 'textarea')}
      {field('photo', 'Portrait Photo')}
    </>
  )

  if (section === 'team') return (
    <>
      {field('caption', 'Caption')}
      {field('description', 'Description', 'textarea')}
      {field('photo', 'Group Photo')}
    </>
  )

  if (section === 'stats') return (
    <>
      {field('delivered', 'Projects Delivered')}
      {field('ongoing', 'Ongoing Projects')}
      {field('years', 'Years of Experience')}
      {field('families', 'Happy Families')}
    </>
  )

  if (section === 'features') {
    const arr = Array.isArray(val) ? val : (val.items || [])
    const setArr = (a) => update('__arr', a)
    const list = Array.isArray(val) ? val : []
    return (
      <>
        {list.map((f, i) => (
          <div key={i} className="card" style={{ padding: 16, marginBottom: 12 }}>
            <div className="field"><label>Title</label>
              <input value={f.title || ''} onChange={e => {
                const n = [...list]; n[i] = { ...f, title: e.target.value }; setArr(n)
              }} />
            </div>
            <div className="field"><label>Description</label>
              <textarea value={f.description || ''} onChange={e => {
                const n = [...list]; n[i] = { ...f, description: e.target.value }; setArr(n)
              }} />
            </div>
            <button type="button" className="btn btn-ghost btn-sm" style={{ color: 'var(--danger)' }}
              onClick={() => setArr(list.filter((_, j) => j !== i))}>Remove</button>
          </div>
        ))}
        <button type="button" className="btn btn-outline btn-sm"
          onClick={() => setArr([...list, { title: '', description: '' }])}>+ Add Feature</button>
      </>
    )
  }

  if (section === 'constructionContent') return (
    <>
      {field('heading', 'Heading')}
      {field('intro', 'Intro', 'textarea')}
    </>
  )

  if (section === 'cta') return (
    <>
      {field('heading', 'Heading')}
      {field('description', 'Description', 'textarea')}
      {field('primaryBtnText', 'Primary Button Text')}
      {field('secondaryBtnText', 'Secondary Button Text')}
      {field('backgroundImage', 'Background Image')}
    </>
  )

  if (section === 'contact') return (
    <>
      {field('address', 'Office Address', 'textarea')}
      {field('phone', 'Phone')}
      {field('email', 'Email')}
      {field('whatsapp', 'WhatsApp Number')}
      {field('hours', 'Working Hours')}
      {field('map_embed', 'Google Maps iframe HTML', 'textarea')}
      <div className="field"><label>Instagram</label><input value={val.social?.instagram || ''} onChange={e => update('social', { ...(val.social || {}), instagram: e.target.value })} /></div>
      <div className="field"><label>Facebook</label><input value={val.social?.facebook || ''} onChange={e => update('social', { ...(val.social || {}), facebook: e.target.value })} /></div>
      <div className="field"><label>YouTube</label><input value={val.social?.youtube || ''} onChange={e => update('social', { ...(val.social || {}), youtube: e.target.value })} /></div>
      <div className="field"><label>LinkedIn</label><input value={val.social?.linkedin || ''} onChange={e => update('social', { ...(val.social || {}), linkedin: e.target.value })} /></div>
      <div className="field"><label>X / Twitter</label><input value={val.social?.twitter || ''} onChange={e => update('social', { ...(val.social || {}), twitter: e.target.value })} /></div>
    </>
  )

  if (section === 'seo') return (
    <>
      {field('homeTitle', 'Home Title')}
      {field('homeDescription', 'Home Meta Description', 'textarea')}
      {field('ogImage', 'Default OG Image')}
    </>
  )

  if (section === 'settings') return (
    <>
      {field('siteName', 'Site Name')}
      {field('siteUrl', 'Site URL')}
      {field('logo', 'Logo')}
      {field('footerDescription', 'Footer Description', 'textarea')}
    </>
  )

  return null
}
