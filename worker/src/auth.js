// HMAC-signed token authentication (no external deps)

const enc = new TextEncoder()
const dec = new TextDecoder()

function b64url(bytes) {
  let bin = ''
  for (const b of bytes) bin += String.fromCharCode(b)
  return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}
function b64urlDecode(str) {
  const pad = str.length % 4 ? 4 - (str.length % 4) : 0
  const s = str.replace(/-/g, '+').replace(/_/g, '/') + '='.repeat(pad)
  const bin = atob(s)
  const bytes = new Uint8Array(bin.length)
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i)
  return bytes
}

async function hmacKey(secret) {
  return crypto.subtle.importKey('raw', enc.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign', 'verify'])
}

export async function signToken(payload, secret, ttlSeconds = 60 * 60 * 24 * 7) {
  const body = { ...payload, exp: Math.floor(Date.now() / 1000) + ttlSeconds }
  const bodyStr = b64url(enc.encode(JSON.stringify(body)))
  const key = await hmacKey(secret)
  const sig = await crypto.subtle.sign('HMAC', key, enc.encode(bodyStr))
  return `${bodyStr}.${b64url(new Uint8Array(sig))}`
}

export async function verifyToken(token, secret) {
  if (!token || !token.includes('.')) return null
  const [bodyStr, sigStr] = token.split('.')
  try {
    const key = await hmacKey(secret)
    const valid = await crypto.subtle.verify('HMAC', key, b64urlDecode(sigStr), enc.encode(bodyStr))
    if (!valid) return null
    const payload = JSON.parse(dec.decode(b64urlDecode(bodyStr)))
    if (!payload.exp || payload.exp < Math.floor(Date.now() / 1000)) return null
    return payload
  } catch { return null }
}

export async function hashPassword(password, saltHex) {
  const salt = saltHex ? hexToBuf(saltHex) : crypto.getRandomValues(new Uint8Array(16))
  const keyMaterial = await crypto.subtle.importKey('raw', enc.encode(password), 'PBKDF2', false, ['deriveBits'])
  const bits = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', salt, iterations: 100_000, hash: 'SHA-256' },
    keyMaterial,
    256
  )
  return `pbkdf2$100000$${bufToHex(salt)}$${bufToHex(new Uint8Array(bits))}`
}

export async function verifyPassword(password, stored) {
  try {
    const [, iter, saltHex, hashHex] = stored.split('$')
    const salt = hexToBuf(saltHex)
    const keyMaterial = await crypto.subtle.importKey('raw', enc.encode(password), 'PBKDF2', false, ['deriveBits'])
    const bits = await crypto.subtle.deriveBits(
      { name: 'PBKDF2', salt, iterations: Number(iter), hash: 'SHA-256' },
      keyMaterial,
      256
    )
    return bufToHex(new Uint8Array(bits)) === hashHex
  } catch { return false }
}

function bufToHex(buf) {
  return [...buf].map(b => b.toString(16).padStart(2, '0')).join('')
}
function hexToBuf(hex) {
  const out = new Uint8Array(hex.length / 2)
  for (let i = 0; i < out.length; i++) out[i] = parseInt(hex.substr(i * 2, 2), 16)
  return out
}
