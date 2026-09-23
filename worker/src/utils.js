export function json(data, status = 200, extra = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', ...extra }
  })
}
export function error(message, status = 400) {
  return json({ error: message }, status)
}
export function cors() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type,Authorization'
  }
}
export function withCors(res) {
  const headers = new Headers(res.headers)
  Object.entries(cors()).forEach(([k, v]) => headers.set(k, v))
  return new Response(res.body, { status: res.status, headers })
}
export function sanitize(s) {
  return String(s ?? '').replace(/[<>]/g, '').slice(0, 4000)
}
export function validEmail(s) {
  return !s || /^\S+@\S+\.\S+$/.test(s)
}
export function validPhone(s) {
  return /^[\d+\-\s()]{7,}$/.test(String(s || ''))
}
