import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api, setToken } from '../../services/api.js'

export default function Login() {
  const [username, setU] = useState('')
  const [password, setP] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const nav = useNavigate()

  async function submit(e) {
    e.preventDefault()
    setError(''); setLoading(true)
    try {
      const r = await api.login(username, password)
      setToken(r.token)
      nav('/admin/dashboard')
    } catch (err) {
      setError(err.message || 'Login failed')
    } finally { setLoading(false) }
  }

  return (
    <div className="login-page">
      <form className="login-card" onSubmit={submit}>
        <div className="brand" style={{ marginBottom: 28 }}>
          <span className="brand-mark">MJ</span>
          <span>MJ Developers</span>
        </div>
        <h1>Admin Sign In</h1>
        <p className="sub">Manage your website content securely.</p>

        {error && (
          <div style={{ padding: 12, background: '#fbe8e8', color: '#b23b3b', borderRadius: 6, marginBottom: 20, fontSize: 13 }}>
            {error}
          </div>
        )}

        <div className="field">
          <label htmlFor="u">Username</label>
          <input id="u" value={username} onChange={e => setU(e.target.value)} autoComplete="username" />
        </div>
        <div className="field">
          <label htmlFor="p">Password</label>
          <input id="p" type="password" value={password} onChange={e => setP(e.target.value)} autoComplete="current-password" />
        </div>
        <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
          {loading ? 'Signing in…' : 'Sign In'}
        </button>
      </form>
    </div>
  )
}
