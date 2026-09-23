import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../services/api.js'

export default function ProjectsAdmin() {
  const [items, setItems] = useState([])
  const [q, setQ] = useState('')

  async function load() {
    const d = await api.adminList('projects')
    setItems(d.items || [])
  }
  useEffect(() => { load() }, [])

  async function remove(id) {
    if (!confirm('Delete this project?')) return
    await api.adminDelete('projects', id)
    load()
  }

  async function togglePublish(p) {
    await api.adminUpdate('projects', p.id, { ...p, published: p.published ? 0 : 1 })
    load()
  }

  const filtered = items.filter(p =>
    !q || p.name.toLowerCase().includes(q.toLowerCase()) || p.location?.toLowerCase().includes(q.toLowerCase())
  )

  return (
    <>
      <div className="admin-head">
        <h1>Projects</h1>
        <Link to="/admin/projects/new" className="btn btn-primary btn-sm">+ New Project</Link>
      </div>

      <div className="panel">
        <div className="field" style={{ maxWidth: 320 }}>
          <input placeholder="Search…" value={q} onChange={e => setQ(e.target.value)} />
        </div>

        <div className="table-wrap">
          <table className="admin">
            <thead>
              <tr><th>Name</th><th>Location</th><th>Status</th><th>Flags</th><th></th></tr>
            </thead>
            <tbody>
              {filtered.map(p => (
                <tr key={p.id}>
                  <td><strong>{p.name}</strong><br/><span style={{ color: 'var(--ink-3)', fontSize: 12 }}>{p.slug}</span></td>
                  <td>{p.location}</td>
                  <td>{p.status}</td>
                  <td>
                    {p.featured ? <span className="badge featured">Featured</span> : null}{' '}
                    <span className={`badge ${p.published ? 'published' : 'draft'}`}>{p.published ? 'Published' : 'Draft'}</span>
                  </td>
                  <td>
                    <div className="flex gap-2">
                      <Link to={`/admin/projects/${p.id}`} className="btn btn-ghost btn-sm">Edit</Link>
                      <button className="btn btn-ghost btn-sm" onClick={() => togglePublish(p)}>
                        {p.published ? 'Unpublish' : 'Publish'}
                      </button>
                      <button className="btn btn-ghost btn-sm" style={{ color: 'var(--danger)' }} onClick={() => remove(p.id)}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan="5" style={{ textAlign: 'center', padding: 40, color: 'var(--ink-3)' }}>No projects yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}
