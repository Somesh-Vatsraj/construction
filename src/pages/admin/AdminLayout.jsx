import { useEffect, useState } from 'react'
import { NavLink, Navigate, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { api, getToken, setToken } from '../../services/api.js'

const NAV = [
  { to: '/admin/dashboard', label: 'Dashboard' },
  { to: '/admin/projects', label: 'Projects' },
  { to: '/admin/content', label: 'Homepage & Content' },
  { to: '/admin/lists', label: 'Amenities · Testimonials · Gallery' },
  { to: '/admin/enquiries', label: 'Enquiries' },
  { to: '/admin/site-visits', label: 'Site Visits' }
]

export default function AdminLayout() {
  const token = getToken()
  const [checking, setChecking] = useState(true)
  const [ok, setOk] = useState(false)
  const nav = useNavigate()
  const loc = useLocation()

  useEffect(() => {
    if (!token) { nav('/admin/login'); return }
    api.me().then(() => setOk(true)).catch(() => {
      setToken(''); nav('/admin/login')
    }).finally(() => setChecking(false))
  }, [token, nav])

  if (!token) return <Navigate to="/admin/login" replace />
  if (checking) return <div style={{ padding: 60 }}>Checking authentication…</div>
  if (!ok) return null

  function logout() {
    setToken('')
    nav('/admin/login')
  }

  return (
    <div className="admin-shell">
      <aside className="admin-side">
        <div className="admin-brand">
          <span className="brand-mark">MJ</span>
          <span>Admin</span>
        </div>
        <nav className="admin-nav">
          {NAV.map(n => (
            <NavLink key={n.to} to={n.to}>{n.label}</NavLink>
          ))}
          <a href="/" target="_blank" rel="noreferrer">View Website ↗</a>
        </nav>
        <div style={{ marginTop: 'auto', paddingTop: 30 }}>
          <button className="btn btn-outline btn-sm btn-block" onClick={logout} style={{ color: '#fff', borderColor: 'rgba(255,255,255,.3)' }}>
            Sign Out
          </button>
        </div>
      </aside>
      <main className="admin-main" key={loc.pathname}>
        <Outlet />
      </main>
    </div>
  )
}
