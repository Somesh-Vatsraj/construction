export function formatDate(iso) {
  if (!iso) return ''
  try {
    return new Date(iso).toLocaleDateString('en-IN', {
      year: 'numeric', month: 'short', day: 'numeric'
    })
  } catch { return iso }
}

export function slugify(s) {
  return String(s || '')
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function whatsappLink(number, message) {
  const n = String(number || '').replace(/[^\d]/g, '')
  return `https://wa.me/${n}${message ? `?text=${encodeURIComponent(message)}` : ''}`
}
