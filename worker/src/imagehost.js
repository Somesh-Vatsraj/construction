// Pluggable image-hosting adapter.
// Change IMAGE_HOST env var to switch providers without rebuilding.

export async function uploadImage(env, file, filename = 'image.jpg') {
  const provider = env.IMAGE_HOST || 'imgbb'
  switch (provider) {
    case 'imgbb': return uploadImgbb(env, file, filename)
    case 'cloudinary': return uploadCloudinary(env, file)
    default: throw new Error(`Unknown image host: ${provider}`)
  }
}

async function uploadImgbb(env, file, filename) {
  if (!env.IMGBB_API_KEY) throw new Error('IMGBB_API_KEY not set')
  const buf = await file.arrayBuffer()
  const b64 = arrayBufferToBase64(buf)
  const body = new URLSearchParams()
  body.set('key', env.IMGBB_API_KEY)
  body.set('image', b64)
  body.set('name', filename)
  const res = await fetch('https://api.imgbb.com/1/upload', {
    method: 'POST',
    body
  })
  const data = await res.json()
  if (!data.success) throw new Error(data.error?.message || 'ImgBB upload failed')
  return {
    url: data.data.url,
    thumb: data.data.thumb?.url || data.data.display_url,
    delete_url: data.data.delete_url,
    provider: 'imgbb',
    meta: { width: data.data.width, height: data.data.height, size: data.data.size }
  }
}

async function uploadCloudinary(env, file) {
  if (!env.CLOUDINARY_CLOUD || !env.CLOUDINARY_PRESET) throw new Error('Cloudinary config missing')
  const fd = new FormData()
  fd.append('file', file)
  fd.append('upload_preset', env.CLOUDINARY_PRESET)
  const res = await fetch(`https://api.cloudinary.com/v1_1/${env.CLOUDINARY_CLOUD}/auto/upload`, {
    method: 'POST',
    body: fd
  })
  const data = await res.json()
  return { url: data.secure_url, thumb: data.secure_url, provider: 'cloudinary' }
}

function arrayBufferToBase64(buf) {
  const bytes = new Uint8Array(buf)
  let bin = ''
  const chunk = 0x8000
  for (let i = 0; i < bytes.length; i += chunk) {
    bin += String.fromCharCode.apply(null, bytes.subarray(i, i + chunk))
  }
  return btoa(bin)
}
