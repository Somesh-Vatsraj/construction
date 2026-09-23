import { signToken, verifyToken, hashPassword, verifyPassword } from './auth.js'
import { uploadImage } from './imagehost.js'
import { json, error, withCors, sanitize, validEmail, validPhone } from './utils.js'

export default {
  async fetch(request, env, ctx) {
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders() })
    }
    try {
      const res = await route(request, env)
      return withCors(res)
    } catch (e) {
      console.error(e)
      return withCors(json({ error: 'Server error' }, 500))
    }
  }
}

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type,Authorization'
  }
}

async function route(request, env) {
  const url = new URL(request.url)
  const path = url.pathname.replace(/\/+$/, '') || '/'
  const method = request.method

  // ---------- Public ----------
  if (path === '/api/site' && method === 'GET') return getSite(env)
  if (path === '/api/projects' && method === 'GET') return getPublicProjects(env)
  if (path.startsWith('/api/projects/') && method === 'GET') return getPublicProject(env, path.split('/').pop())
  if (path === '/api/amenities' && method === 'GET') return listPublic(env, 'amenities')
  if (path === '/api/testimonials' && method === 'GET') return listPublic(env, 'testimonials')
  if (path === '/api/gallery' && method === 'GET') return listPublic(env, 'gallery')
  if (path === '/api/construction' && method === 'GET') return listPublic(env, 'construction_progress')
  if (path === '/api/enquiries' && method === 'POST') return createEnquiry(request, env)
  if (path === '/api/site-visits' && method === 'POST') return createSiteVisit(request, env)

  // ---------- Auth ----------
  if (path === '/api/auth/login' && method === 'POST') return login(request, env)
  if (path === '/api/auth/me' && method === 'GET') return requireAuth(request, env, meHandler)

  // ---------- Admin (protected) ----------
  if (path.startsWith('/api/admin/')) {
    return requireAuth(request, env, async (user) => {
      return adminRouter(request, env, path, method, user)
    })
  }

  return json({ error: 'Not found' }, 404)
}

/* ---------- Auth guard ---------- */
async function requireAuth(request, env, handler) {
  const header = request.headers.get('Authorization') || ''
  const token = header.replace(/^Bearer\s+/i, '')
  const payload = await verifyToken(token, env.ADMIN_JWT_SECRET || 'dev-secret-change-me')
  if (!payload) return json({ error: 'Unauthorized' }, 401)
  return handler(payload)
}

async function meHandler(payload) {
  return json({ user: { id: payload.sub, username: payload.username } })
}

async function login(request, env) {
  const { username, password } = await request.json().catch(() => ({}))
  if (!username || !password) return error('Missing credentials', 400)

  const row = await env.DB.prepare('SELECT * FROM admins WHERE username = ?').bind(username).first()
  if (!row) return error('Invalid credentials', 401)
  const ok = await verifyPassword(password, row.password_hash)
  if (!ok) return error('Invalid credentials', 401)

  const token = await signToken(
    { sub: row.id, username: row.username },
    env.ADMIN_JWT_SECRET || 'dev-secret-change-me'
  )
  return json({ token })
}

/* ---------- Public GET ---------- */
async function getSite(env) {
  // Load all content keys + settings + contact + seo in one call
  const rows = await env.DB.prepare('SELECT key, value FROM content').all()
  const content = {}
  for (const r of rows.results || []) {
    try { content[r.key] = JSON.parse(r.value) } catch { content[r.key] = r.value }
  }

  return json({
    homepage: content.homepage || {},
    about: content.about || {},
    owner: content.owner || {},
    team: content.team || {},
    stats: content.stats || {},
    features: content.features || [],
    constructionContent: content.constructionContent || {},
    cta: content.cta || {},
    contact: content.contact || {},
    seo: content.seo || {},
    settings: content.settings || {}
  })
}

async function getPublicProjects(env) {
  const rows = await env.DB.prepare(
    'SELECT * FROM projects WHERE published = 1 ORDER BY sort_order ASC, created_at DESC'
  ).all()
  return json({ projects: (rows.results || []).map(parseProject) })
}

async function getPublicProject(env, slug) {
  const row = await env.DB.prepare(
    'SELECT * FROM projects WHERE slug = ? AND published = 1'
  ).bind(slug).first()
  if (!row) return json({ error: 'Not found' }, 404)
  return json({ project: parseProject(row) })
}

async function listPublic(env, table) {
  const order = table === 'gallery' ? 'sort_order ASC, created_at DESC' : 'sort_order ASC, created_at ASC'
  const rows = await env.DB.prepare(`SELECT * FROM ${table}`).all()
  const key = table === 'construction_progress' ? 'construction' : table
  return json({ [key]: rows.results || [] })
}

async function createEnquiry(request, env) {
  const body = await request.json().catch(() => ({}))
  const name = sanitize(body.name)
  const phone = sanitize(body.phone)
  const email = sanitize(body.email)
  const project = sanitize(body.project)
  const message = sanitize(body.message)

  if (!name || !phone || !message) return error('Missing required fields', 400)
  if (!validPhone(phone)) return error('Invalid phone', 400)
  if (!validEmail(email)) return error('Invalid email', 400)

  await env.DB.prepare(
    'INSERT INTO enquiries (name, phone, email, project, message) VALUES (?,?,?,?,?)'
  ).bind(name, phone, email, project, message).run()

  return json({ ok: true })
}

async function createSiteVisit(request, env) {
  const body = await request.json().catch(() => ({}))
  const name = sanitize(body.name)
  const phone = sanitize(body.phone)
  const email = sanitize(body.email)
  const project = sanitize(body.project)
  const preferred_date = sanitize(body.preferred_date)
  const preferred_time = sanitize(body.preferred_time)
  const message = sanitize(body.message)

  if (!name || !phone) return error('Missing required fields', 400)

  await env.DB.prepare(
    'INSERT INTO site_visits (name, phone, email, project, preferred_date, preferred_time, message) VALUES (?,?,?,?,?,?,?)'
  ).bind(name, phone, email, project, preferred_date, preferred_time, message).run()

  return json({ ok: true })
}

/* ---------- Admin router ---------- */
const ALLOWED_RESOURCES = {
  projects: { table: 'projects' },
  amenities: { table: 'amenities' },
  testimonials: { table: 'testimonials' },
  gallery: { table: 'gallery' },
  enquiries: { table: 'enquiries', readOnly: true },
  'site-visits': { table: 'site_visits' }
}

async function adminRouter(request, env, path, method, user) {
  // /api/admin/{resource}[/{id}]
  const parts = path.replace('/api/admin/', '').split('/')
  const resource = parts[0]
  const id = parts[1]

  if (resource === 'stats' && method === 'GET') return adminStats(env)
  if (resource === 'upload' && method === 'POST') return adminUpload(request, env)
  if (resource === 'content' && method === 'GET') return adminGetContent(env)
  if (resource === 'content' && method === 'PUT') return adminPutContent(request, env, id)

  const conf = ALLOWED_RESOURCES[resource]
  if (!conf) return json({ error: 'Unknown resource' }, 404)

  if (method === 'GET' && !id) return adminList(env, conf.table)
  if (method === 'GET' && id) return adminGet(env, conf.table, id)
  if (method === 'POST' && !id) return adminCreate(request, env, conf.table, resource)
  if (method === 'PUT' && id) return adminUpdate(request, env, conf.table, id)
  if (method === 'DELETE' && id && !conf.readOnly) return adminDelete(env, conf.table, id)

  return json({ error: 'Method not allowed' }, 405)
}

async function adminStats(env) {
  const [total, ongoing, completed, newE, visits, gallery] = await Promise.all([
    env.DB.prepare('SELECT COUNT(*) as c FROM projects').first(),
    env.DB.prepare("SELECT COUNT(*) as c FROM projects WHERE status = 'Ongoing'").first(),
    env.DB.prepare("SELECT COUNT(*) as c FROM projects WHERE status = 'Completed'").first(),
    env.DB.prepare("SELECT COUNT(*) as c FROM enquiries WHERE status = 'New'").first(),
    env.DB.prepare('SELECT COUNT(*) as c FROM site_visits').first(),
    env.DB.prepare('SELECT COUNT(*) as c FROM gallery').first()
  ])
  return json({
    totalProjects: total?.c ?? 0,
    ongoing: ongoing?.c ?? 0,
    completed: completed?.c ?? 0,
    newEnquiries: newE?.c ?? 0,
    siteVisits: visits?.c ?? 0,
    galleryImages: gallery?.c ?? 0
  })
}

async function adminList(env, table) {
  const order = table === 'enquiries' || table === 'site_visits' ? 'created_at DESC' : 'sort_order ASC, created_at ASC'
  const rows = await env.DB.prepare(`SELECT * FROM ${table} ORDER BY ${order}`).all()
  const items = (rows.results || []).map(row => table === 'projects' ? parseProject(row) : row)
  return json({ items })
}

async function adminGet(env, table, id) {
  const row = await env.DB.prepare(`SELECT * FROM ${table} WHERE id = ?`).bind(id).first()
  if (!row) return json({ error: 'Not found' }, 404)
  return json({ item: table === 'projects' ? parseProject(row) : row })
}

const PROJECT_JSON_FIELDS = ['gallery', 'amenities', 'floor_plans', 'specifications', 'highlights']

function parseProject(row) {
  if (!row) return row
  const out = { ...row }
  for (const f of PROJECT_JSON_FIELDS) {
    if (typeof out[f] === 'string') {
      try { out[f] = JSON.parse(out[f]) } catch { out[f] = [] }
    } else if (out[f] == null) {
      out[f] = []
    }
  }
  return out
}

async function adminCreate(request, env, table, resource) {
  const body = await request.json()
  const sanitized = sanitizeBody(table, body)
  const keys = Object.keys(sanitized)
  const placeholders = keys.map(() => '?').join(',')
  const values = keys.map(k => sanitized[k])
  const stmt = env.DB.prepare(
    `INSERT INTO ${table} (${keys.join(',')}) VALUES (${placeholders})`
  ).bind(...values)
  const res = await stmt.run()
  return json({ ok: true, id: res.meta?.last_row_id })
}

async function adminUpdate(request, env, table, id) {
  const body = await request.json()
  const sanitized = sanitizeBody(table, body)
  delete sanitized.id
  delete sanitized.created_at
  const keys = Object.keys(sanitized)
  const setClause = keys.map(k => `${k} = ?`).join(', ')
  const values = keys.map(k => sanitized[k])
  await env.DB.prepare(
    `UPDATE ${table} SET ${setClause}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`
  ).bind(...values, id).run()
  return json({ ok: true })
}

async function adminDelete(env, table, id) {
  await env.DB.prepare(`DELETE FROM ${table} WHERE id = ?`).bind(id).run()
  return json({ ok: true })
}

function sanitizeBody(table, body) {
  const out = {}
  for (const [k, v] of Object.entries(body || {})) {
    if (PROJECT_JSON_FIELDS.includes(k)) {
      out[k] = JSON.stringify(v || [])
    } else if (typeof v === 'boolean') {
      out[k] = v ? 1 : 0
    } else if (typeof v === 'number') {
      out[k] = v
    } else if (v === null || v === undefined) {
      out[k] = null
    } else {
      out[k] = String(v).slice(0, 20000)
    }
  }
  return out
}

async function adminGetContent(env) {
  const rows = await env.DB.prepare('SELECT key, value FROM content').all()
  const content = {}
  for (const r of rows.results || []) {
    try { content[r.key] = JSON.parse(r.value) } catch { content[r.key] = r.value }
  }
  return json({ content })
}

async function adminPutContent(request, env, key) {
  if (!key) return error('Missing key', 400)
  const body = await request.json()
  const value = JSON.stringify(body.value ?? null)
  await env.DB.prepare(
    'INSERT INTO content (key, value, updated_at) VALUES (?, ?, CURRENT_TIMESTAMP) ' +
    'ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = CURRENT_TIMESTAMP'
  ).bind(key, value).run()
  return json({ ok: true })
}

async function adminUpload(request, env) {
  const formData = await request.formData()
  const file = formData.get('image')
  if (!file || typeof file === 'string') return error('No image', 400)
  const meta = {
    category: formData.get('category') || '',
    project_id: formData.get('project_id') || null
  }

  const result = await uploadImage(env, file, file.name || 'upload.jpg')

  // Save metadata row (for the media library)
  await env.DB.prepare(
    'INSERT INTO media (url, thumb, alt_text, title, category, project_id, provider, meta) VALUES (?,?,?,?,?,?,?,?)'
  ).bind(
    result.url,
    result.thumb || result.url,
    '',
    file.name || '',
    meta.category,
    meta.project_id,
    result.provider,
    JSON.stringify(result.meta || {})
  ).run()

  return json({ url: result.url, thumb: result.thumb || result.url, provider: result.provider })
}
