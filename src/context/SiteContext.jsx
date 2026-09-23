import { createContext, useContext, useEffect, useState } from 'react'
import { api } from '../services/api.js'

const SiteContext = createContext(null)

export function SiteProvider({ children }) {
  const [site, setSite] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  async function load() {
    try {
      setLoading(true)
      const data = await api.getSite()
      setSite(data)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  return (
    <SiteContext.Provider value={{ site, loading, error, reload: load }}>
      {children}
    </SiteContext.Provider>
  )
}

export function useSite() {
  const ctx = useContext(SiteContext)
  if (!ctx) throw new Error('useSite must be inside SiteProvider')
  return ctx
}
