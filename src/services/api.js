const API_BASE = import.meta.env.VITE_API_BASE || '/api'
const TOKEN_KEY = 'mj_admin_token'

export function getToken() {
  return localStorage.getItem(TOKEN_KEY) || ''
}
export function setToken(t) {
  if (t) localStorage.setItem(TOKEN_KEY, t)
  else localStorage.removeItem(TOKEN_KEY)
}

async function request(path, { method = 'GET', body, auth = false } = {}) {
  const headers = { 'Content-Type': 'application/json' }
  if (auth) {
    const t = getToken()
    if (t) headers.Authorization = `Bearer ${t}`
  }
  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined
  })
  const text = await res.text()
  let data = null
  try { data = text ? JSON.parse(text) : null } catch { data = { error: text } }
  if (!res.ok) {
    const err = new Error(data?.error || `Request failed (${res.status})`)
    err.status = res.status
    err.data = data
    throw err
  }
  return data
}

export const api = {
  // Public
  getSite: () => request('/site'),
  getProjects: () => request('/projects'),
  getProject: (slug) => request(`/projects/${slug}`),
  getAmenities: () => request('/amenities'),
  getTestimonials: () => request('/testimonials'),
  getGallery: () => request('/gallery'),
  getConstruction: () => request('/construction'),
  createEnquiry: (payload) => request('/enquiries', { method: 'POST', body: payload }),
  createSiteVisit: (payload) => request('/site-visits', { method: 'POST', body: payload }),

  // Auth
  login: (username, password) =>
    request('/auth/login', { method: 'POST', body: { username, password } }),
  me: () => request('/auth/me', { auth: true }),

  // Admin — generic
  adminList: (resource) => request(`/admin/${resource}`, { auth: true }),
  adminGet: (resource, id) => request(`/admin/${resource}/${id}`, { auth: true }),
  adminCreate: (resource, body) =>
    request(`/admin/${resource}`, { method: 'POST', body, auth: true }),
  adminUpdate: (resource, id, body) =>
    request(`/admin/${resource}/${id}`, { method: 'PUT', body, auth: true }),
  adminDelete: (resource, id) =>
    request(`/admin/${resource}/${id}`, { method: 'DELETE', auth: true }),

  // Content
  getContent: () => request('/admin/content', { auth: true }),
  updateContent: (key, value) =>
    request(`/admin/content/${key}`, { method: 'PUT', body: { value }, auth: true }),

  // Stats
  stats: () => request('/admin/stats', { auth: true }),

  // Upload
  upload: async (file, meta = {}) => {
    const fd = new FormData()
    fd.append('image', file)
    for (const [k, v] of Object.entries(meta)) fd.append(k, v)
    const res = await fetch(`${API_BASE}/admin/upload`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${getToken()}` },
      body: fd
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.error || 'Upload failed')
    return data
  }
}
