import { useEffect, useState } from 'react'
import { api } from '../../services/api.js'
import { formatDate } from '../../utils/format.js'

export default function EnquiriesAdmin() {
  const [items, setItems] = useState([])
  const [q, setQ] = useState('')

  async function load() {
    const d = await api.adminList('enquiries')
    setItems(d.items || [])
  }
  useEffect(() => { load() }, [])

  async function remove(id) {
    if (!confirm('Delete this enquiry?')) return
    await api.adminDelete('enquiries', id)
    load()
  }

  const filtered = items.filter(e =>
    !q || e.name.toLowerCase().includes(q.toLowerCase()) || e.phone.includes(q)
  )

  return (
    <>
      <div className="admin-head"><h1>Enquiries</h1></div>
      <div className="panel">
        <div className="field" style={{ maxWidth: 320 }}>
          <input placeholder="Search by name or phone…" value={q} onChange={e => setQ(e.target.value)} />
        </div>
        <div className="table-wrap">
          <table className="admin">
            <thead><tr><th>Name</th><th>Phone</th><th>Email</th><th>Project</th><th>Message</th><th>Received</th><th></th></tr></thead>
            <tbody>
              {filtered.map(e => (
                <tr key={e.id}>
                  <td>{e.name}</td>
                  <td>{e.phone}</td>
                  <td>{e.email || '—'}</td>
                  <td>{e.project || '—'}</td>
                  <td style={{ maxWidth: 260 }}>{e.message}</td>
                  <td>{formatDate(e.created_at)}</td>
                  <td><button className="btn btn-ghost btn-sm" style={{ color: 'var(--danger)' }} onClick={() => remove(e.id)}>Delete</button></td>
                </tr>
              ))}
              {filtered.length === 0 && <tr><td colSpan="7" style={{ textAlign: 'center', padding: 40, color: 'var(--ink-3)' }}>No enquiries yet.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}
