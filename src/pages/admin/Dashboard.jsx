import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../services/api.js'
import { formatDate } from '../../utils/format.js'

export default function Dashboard() {
  const [stats, setStats] = useState(null)
  const [enquiries, setEnquiries] = useState([])
  const [visits, setVisits] = useState([])

  useEffect(() => {
    api.stats().then(d => setStats(d)).catch(() => {})
    api.adminList('enquiries').then(d => setEnquiries((d.items || []).slice(0, 6))).catch(() => {})
    api.adminList('site-visits').then(d => setVisits((d.items || []).slice(0, 6))).catch(() => {})
  }, [])

  const cards = [
    ['Total Projects', stats?.totalProjects ?? '—'],
    ['Ongoing', stats?.ongoing ?? '—'],
    ['Completed', stats?.completed ?? '—'],
    ['New Enquiries', stats?.newEnquiries ?? '—'],
    ['Site Visit Requests', stats?.siteVisits ?? '—'],
    ['Gallery Images', stats?.galleryImages ?? '—']
  ]

  return (
    <>
      <div className="admin-head">
        <h1>Dashboard</h1>
        <Link to="/admin/projects/new" className="btn btn-primary btn-sm">+ New Project</Link>
      </div>

      <div className="admin-cards">
        {cards.map(([label, value]) => (
          <div key={label} className="admin-card">
            <div className="label">{label}</div>
            <div className="value">{value}</div>
          </div>
        ))}
      </div>

      <div className="panel">
        <div className="flex justify-between items-center mb-3">
          <h3 style={{ margin: 0 }}>Recent Enquiries</h3>
          <Link to="/admin/enquiries" className="btn btn-ghost btn-sm">View all →</Link>
        </div>
        <div className="table-wrap">
          {enquiries.length === 0 ? <p style={{ color: 'var(--ink-3)' }}>No enquiries yet.</p> : (
            <table className="admin">
              <thead><tr><th>Name</th><th>Phone</th><th>Project</th><th>Received</th></tr></thead>
              <tbody>
                {enquiries.map(e => (
                  <tr key={e.id}>
                    <td>{e.name}</td>
                    <td>{e.phone}</td>
                    <td>{e.project || '—'}</td>
                    <td>{formatDate(e.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <div className="panel">
        <div className="flex justify-between items-center mb-3">
          <h3 style={{ margin: 0 }}>Recent Site Visits</h3>
          <Link to="/admin/site-visits" className="btn btn-ghost btn-sm">View all →</Link>
        </div>
        <div className="table-wrap">
          {visits.length === 0 ? <p style={{ color: 'var(--ink-3)' }}>No site visits yet.</p> : (
            <table className="admin">
              <thead><tr><th>Name</th><th>Project</th><th>Date</th><th>Status</th></tr></thead>
              <tbody>
                {visits.map(v => (
                  <tr key={v.id}>
                    <td>{v.name}</td>
                    <td>{v.project || '—'}</td>
                    <td>{v.preferred_date || '—'}</td>
                    <td><span className={`badge ${v.status.toLowerCase()}`}>{v.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </>
  )
}
