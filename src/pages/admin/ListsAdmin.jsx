import { useEffect, useState } from 'react'
import { api } from '../../services/api.js'

const RESOURCES = [
  { key: 'amenities', label: 'Amenities', fields: ['name', 'description', 'sort_order'] },
  { key: 'testimonials', label: 'Testimonials', fields: ['name', 'project', 'review', 'photo', 'enabled'] },
  { key: 'gallery', label: 'Gallery', fields: ['url', 'title', 'alt_text', 'category'] }
]

export default function ListsAdmin() {
  const [tab, setTab] = useState('amenities')

  return (
    <>
      <div className="admin-head"><h1>Lists</h1></div>
      <div className="pills">
        {RESOURCES.map(r => (
          <button key={r.key} className={`pill ${tab === r.key ? 'active' : ''}`} onClick={() => setTab(r.key)}>{r.label}</button>
        ))}
      </div>
      <ListEditor resource={RESOURCES.find(r => r.key === tab)} />
    </>
  )
}

function ListEditor({ resource }) {
  const [items, setItems] = useState([])
  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState('')

  async function load() {
    const d = await api.adminList(resource.key)
    setItems(d.items || [])
  }
  useEffect(() => { load() }, [resource.key])

  async function add() {
    const blank = {}
    resource.fields.forEach(f => blank[f] = f === 'enabled' ? 1 : '')
    await api.adminCreate(resource.key, blank)
    load()
  }

  async function save(item) {
    setBusy(true); setMsg('')
    try {
      await api.adminUpdate(resource.key, item.id, item)
      setMsg('Saved'); setTimeout(() => setMsg(''), 1500)
    } catch (e) { setMsg(e.message) } finally { setBusy(false) }
  }

  async function remove(id) {
    if (!confirm('Delete this item?')) return
    await api.adminDelete(resource.key, id)
    load()
  }

  async function upload(item, fieldKey) {
    return async e => {
      const file = e.target.files?.[0]; if (!file) return
      const r = await api.upload(file, { category: resource.key })
      const updated = { ...item, [fieldKey]: r.url }
      await save(updated)
      load()
    }
  }

  return (
    <div className="panel">
      <div className="flex justify-between items-center mb-3">
        <h3 style={{ margin: 0 }}>{resource.label}</h3>
        <button className="btn btn-primary btn-sm" onClick={add}>+ Add</button>
      </div>
      {msg && <div className="toast success">{msg}</div>}

      {items.length === 0 ? <p style={{ color: 'var(--ink-3)' }}>No items yet.</p> : items.map((it, idx) => (
        <div key={it.id} className="card" style={{ padding: 16, marginBottom: 14 }}>
          {resource.fields.map(f => (
            <div className="field" key={f}>
              <label>{f}</label>
              {f === 'enabled' ? (
                <label><input type="checkbox" checked={!!it[f]} onChange={e => setItems(items.map(x => x.id === it.id ? { ...x, [f]: e.target.checked ? 1 : 0 } : x))} /> Visible on site</label>
              ) : f === 'review' || f === 'description' ? (
                <textarea value={it[f] || ''} onChange={e => setItems(items.map(x => x.id === it.id ? { ...x, [f]: e.target.value } : x))} />
              ) : (
                <input value={it[f] || ''} onChange={e => setItems(items.map(x => x.id === it.id ? { ...x, [f]: e.target.value } : x))} />
              )}
              {['photo', 'url'].includes(f) && (
                <input type="file" accept="image/*" onChange={upload(it, f)} style={{ marginTop: 8 }} />
              )}
            </div>
          ))}
          <div className="flex gap-2">
            <button className="btn btn-primary btn-sm" onClick={() => save(it)} disabled={busy}>Save</button>
            <button className="btn btn-ghost btn-sm" style={{ color: 'var(--danger)' }} onClick={() => remove(it.id)}>Delete</button>
          </div>
        </div>
      ))}
    </div>
  )
}
