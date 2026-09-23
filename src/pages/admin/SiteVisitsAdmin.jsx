import { useEffect, useState } from 'react'
import { api } from '../../services/api.js'
import { formatDate } from '../../utils/format.js'

const STATUSES = ['New', 'Contacted', 'Scheduled', 'Completed', 'Cancelled']

export default function SiteVisitsAdmin() {
  const [items, setItems] = useState([])

  async function load() {
    const d = await api.adminList('site-visits')
    setItems(d.items || [])
  }
  useEffect(() => { load() }, [])

  async function updateStatus(item, status) {
    await api.adminUpdate('site-visits', item.id, { ...item, status })
    load()
  }

  async function remove(id) {
    if (!confirm('Delete this request?')) return
    await api.adminDelete('site-visits', id)
    load()
  }

  return (
    <>
      <div className="admin-head"><h1>Site Visit Requests</h1></div>
      <div className="panel">
        <div className="table-wrap">
          <table className="admin">
            <thead><tr><th>Name</th><th>Phone</th><th>Project</th><th>Date</th><th>Time</th><th>Status</th><th></th></tr></thead>
            <tbody>
              {items.map(v => (
                <tr key={v.id}>
                  <td>{v.name}</td>
                  <td>{v.phone}</td>
                  <td>{v.project || '—'}</td>
                  <td>{v.preferred_date || '—'}</td>
                  <td>{v.preferred_time || '—'}</td>
                  <td>
                    <select value={v.status} onChange={e => updateStatus(v, e.target.value)}>
                      {STATUSES.map(s => <option key={s}>{s}</option>)}
                    </select>
                  </td>
                  <td><button className="btn btn-ghost btn-sm" style={{ color: 'var(--danger)' }} onClick={() => remove(v.id)}>Delete</button></td>
                </tr>
              ))}
              {items.length === 0 && <tr><td colSpan="7" style={{ textAlign: 'center', padding: 40, color: 'var(--ink-3)' }}>No site visits yet.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}
