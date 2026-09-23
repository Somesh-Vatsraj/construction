import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { api } from '../../services/api.js'
import { slugify } from '../../utils/format.js'

const EMPTY = {
  name: '', slug: '', location: '', property_type: 'Residential Apartments',
  status: 'Upcoming', short_description: '', description: '',
  starting_price: '', bedrooms: '', area: '', possession: '',
  main_image: '', gallery: [], amenities: [], floor_plans: [],
  specifications: [], highlights: [], map_embed: '', brochure_url: '',
  construction_status: 'Planning', progress: 0,
  featured: 0, published: 1,
  seo_title: '', seo_description: '', seo_og_image: ''
}

export default function ProjectForm() {
  const { id } = useParams()
  const nav = useNavigate()
  const isNew = id === 'new'
  const [p, setP] = useState(EMPTY)
  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState('')

  useEffect(() => {
    if (!isNew) {
      api.adminGet('projects', id).then(d => setP({ ...EMPTY, ...d.item })).catch(() => {})
    }
  }, [id, isNew])

  function set(k, v) { setP(prev => ({ ...prev, [k]: v })) }

  async function save(e) {
    e.preventDefault()
    setBusy(true); setMsg('')
    try {
      const payload = { ...p, slug: p.slug || slugify(p.name) }
      if (isNew) await api.adminCreate('projects', payload)
      else await api.adminUpdate('projects', id, payload)
      setMsg('Saved successfully')
      setTimeout(() => nav('/admin/projects'), 700)
    } catch (err) {
      setMsg(err.message || 'Save failed')
    } finally { setBusy(false) }
  }

  async function uploadImage(e, target) {
    const file = e.target.files?.[0]
    if (!file) return
    try {
      const r = await api.upload(file, { category: 'project' })
      if (target === 'main') set('main_image', r.url)
      else if (target === 'og') set('seo_og_image', r.url)
      else if (target === 'gallery') set('gallery', [...(p.gallery || []), { url: r.url, alt: p.name }])
    } catch (err) { alert(err.message) }
  }

  function removeGallery(i) {
    const g = [...(p.gallery || [])]
    g.splice(i, 1)
    set('gallery', g)
  }

  function addFloorPlan() {
    set('floor_plans', [...(p.floor_plans || []), { title: '', area: '', description: '', image: '' }])
  }
  function updateFloorPlan(i, k, v) {
    const fp = [...(p.floor_plans || [])]
    fp[i] = { ...fp[i], [k]: v }
    set('floor_plans', fp)
  }

  return (
    <>
      <div className="admin-head">
        <h1>{isNew ? 'New Project' : 'Edit Project'}</h1>
        <button className="btn btn-outline btn-sm" onClick={() => nav('/admin/projects')}>← Back</button>
      </div>

      {msg && <div className="toast success">{msg}</div>}

      <form onSubmit={save}>
        <div className="panel">
          <h3>Basics</h3>
          <div className="form-row">
            <div className="field">
              <label>Project Name *</label>
              <input required value={p.name} onChange={e => { set('name', e.target.value); if (isNew && !p.slug) set('slug', slugify(e.target.value)) }} />
            </div>
            <div className="field">
              <label>Slug</label>
              <input value={p.slug} onChange={e => set('slug', e.target.value)} />
            </div>
          </div>
          <div className="form-row">
            <div className="field"><label>Location *</label><input required value={p.location} onChange={e => set('location', e.target.value)} /></div>
            <div className="field"><label>Property Type</label><input value={p.property_type} onChange={e => set('property_type', e.target.value)} /></div>
          </div>
          <div className="form-row">
            <div className="field">
              <label>Status</label>
              <select value={p.status} onChange={e => set('status', e.target.value)}>
                <option>Upcoming</option><option>Ongoing</option><option>Completed</option>
              </select>
            </div>
            <div className="field"><label>Starting Price</label><input value={p.starting_price} onChange={e => set('starting_price', e.target.value)} /></div>
          </div>
          <div className="form-row">
            <div className="field"><label>Bedrooms</label><input value={p.bedrooms} onChange={e => set('bedrooms', e.target.value)} /></div>
            <div className="field"><label>Area</label><input value={p.area} onChange={e => set('area', e.target.value)} /></div>
            <div className="field"><label>Possession</label><input value={p.possession} onChange={e => set('possession', e.target.value)} /></div>
          </div>
          <div className="field"><label>Short Description</label><textarea value={p.short_description} onChange={e => set('short_description', e.target.value)} /></div>
          <div className="field"><label>Full Description</label><textarea style={{ minHeight: 180 }} value={p.description} onChange={e => set('description', e.target.value)} /></div>
          <div className="form-row">
            <div className="field">
              <label><input type="checkbox" checked={!!p.featured} onChange={e => set('featured', e.target.checked ? 1 : 0)} /> Featured</label>
            </div>
            <div className="field">
              <label><input type="checkbox" checked={!!p.published} onChange={e => set('published', e.target.checked ? 1 : 0)} /> Published</label>
            </div>
          </div>
        </div>

        <div className="panel">
          <h3>Images</h3>
          <div className="form-row">
            <div className="field">
              <label>Main Image</label>
              <input value={p.main_image} onChange={e => set('main_image', e.target.value)} placeholder="URL" />
              <input type="file" accept="image/*" onChange={e => uploadImage(e, 'main')} style={{ marginTop: 8 }} />
              {p.main_image && <img src={p.main_image} alt="" style={{ maxHeight: 140, marginTop: 10, borderRadius: 6 }} />}
            </div>
            <div className="field">
              <label>SEO OG Image</label>
              <input value={p.seo_og_image} onChange={e => set('seo_og_image', e.target.value)} />
              <input type="file" accept="image/*" onChange={e => uploadImage(e, 'og')} style={{ marginTop: 8 }} />
            </div>
          </div>
          <div className="field">
            <label>Gallery</label>
            <input type="file" accept="image/*" onChange={e => uploadImage(e, 'gallery')} />
            <div className="grid grid-4" style={{ marginTop: 12 }}>
              {(p.gallery || []).map((g, i) => (
                <div key={i} style={{ position: 'relative' }}>
                  <img src={g.url} alt="" style={{ width: '100%', aspectRatio: '4/3', objectFit: 'cover', borderRadius: 6 }} />
                  <button type="button" onClick={() => removeGallery(i)} style={{ position: 'absolute', top: 6, right: 6, background: 'rgba(0,0,0,.7)', color: '#fff', borderRadius: '50%', width: 26, height: 26 }}>×</button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="panel">
          <h3>Construction</h3>
          <div className="form-row">
            <div className="field"><label>Construction Status</label><input value={p.construction_status} onChange={e => set('construction_status', e.target.value)} /></div>
            <div className="field"><label>Progress (%)</label><input type="number" min="0" max="100" value={p.progress} onChange={e => set('progress', Number(e.target.value))} /></div>
          </div>
        </div>

        <div className="panel">
          <h3>Floor Plans</h3>
          {(p.floor_plans || []).map((f, i) => (
            <div key={i} className="card" style={{ padding: 18, marginBottom: 12 }}>
              <div className="form-row">
                <div className="field"><label>Title</label><input value={f.title} onChange={e => updateFloorPlan(i, 'title', e.target.value)} /></div>
                <div className="field"><label>Area</label><input value={f.area} onChange={e => updateFloorPlan(i, 'area', e.target.value)} /></div>
              </div>
              <div className="field"><label>Description</label><input value={f.description} onChange={e => updateFloorPlan(i, 'description', e.target.value)} /></div>
              <div className="field">
                <label>Image</label>
                <input value={f.image} onChange={e => updateFloorPlan(i, 'image', e.target.value)} placeholder="URL" />
                <input type="file" accept="image/*" onChange={async e => {
                  const file = e.target.files?.[0]; if (!file) return
                  const r = await api.upload(file, { category: 'floorplan' })
                  updateFloorPlan(i, 'image', r.url)
                }} style={{ marginTop: 8 }} />
              </div>
            </div>
          ))}
          <button type="button" className="btn btn-outline btn-sm" onClick={addFloorPlan}>+ Add Floor Plan</button>
        </div>

        <div className="panel">
          <h3>Specifications & Highlights</h3>
          <div className="field">
            <label>Highlights (one per line)</label>
            <textarea value={(p.highlights || []).join('\n')} onChange={e => set('highlights', e.target.value.split('\n').filter(Boolean))} />
          </div>
          <div className="field">
            <label>Specifications (one per line)</label>
            <textarea value={(p.specifications || []).join('\n')} onChange={e => set('specifications', e.target.value.split('\n').filter(Boolean))} />
          </div>
          <div className="field">
            <label>Amenities (one per line)</label>
            <textarea value={(p.amenities || []).map(a => typeof a === 'string' ? a : a.name).join('\n')} onChange={e => set('amenities', e.target.value.split('\n').filter(Boolean))} />
          </div>
        </div>

        <div className="panel">
          <h3>Location, Brochure & SEO</h3>
          <div className="field"><label>Map Embed (iframe HTML)</label><textarea value={p.map_embed} onChange={e => set('map_embed', e.target.value)} /></div>
          <div className="field"><label>Brochure URL</label><input value={p.brochure_url} onChange={e => set('brochure_url', e.target.value)} /></div>
          <div className="field"><label>SEO Title</label><input value={p.seo_title} onChange={e => set('seo_title', e.target.value)} /></div>
          <div className="field"><label>SEO Description</label><textarea value={p.seo_description} onChange={e => set('seo_description', e.target.value)} /></div>
        </div>

        <div className="flex gap-2">
          <button type="submit" className="btn btn-primary" disabled={busy}>{busy ? 'Saving…' : 'Save Project'}</button>
          <button type="button" className="btn btn-outline" onClick={() => nav('/admin/projects')}>Cancel</button>
        </div>
      </form>
    </>
  )
}
