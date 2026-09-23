import { useEffect, useMemo, useState } from 'react'
import SEO from '../components/SEO.jsx'
import ProjectCard from '../components/ProjectCard.jsx'
import Spinner from '../components/Spinner.jsx'
import Empty from '../components/Empty.jsx'
import { api } from '../services/api.js'
import { useSite } from '../context/SiteContext.jsx'

const FILTERS = ['All', 'Ongoing', 'Completed', 'Upcoming']

export default function Projects() {
  const { site } = useSite()
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('All')
  const [q, setQ] = useState('')

  useEffect(() => {
    api.getProjects()
      .then(d => setProjects(d.projects || []))
      .finally(() => setLoading(false))
  }, [])

  const list = useMemo(() => {
    return projects
      .filter(p => p.published)
      .filter(p => filter === 'All' || p.status === filter)
      .filter(p => {
        if (!q) return true
        const s = q.toLowerCase()
        return p.name.toLowerCase().includes(s) || p.location.toLowerCase().includes(s)
      })
  }, [projects, filter, q])

  return (
    <>
      <SEO
        title={`Projects — MJ Developers`}
        description="Explore our portfolio of premium residential apartments — ongoing, completed and upcoming."
        canonical={`${site?.settings?.siteUrl || ''}/projects`}
      />
      <section className="section" style={{ paddingTop: 140 }}>
        <div className="container">
          <span className="eyebrow">Our Portfolio</span>
          <h1>Projects crafted for<br/>modern living.</h1>
          <p className="lead mt-2">Browse ongoing, completed and upcoming residential developments.</p>

          <div className="flex items-center justify-between gap-2 mt-4" style={{ flexWrap: 'wrap' }}>
            <div className="pills">
              {FILTERS.map(f => (
                <button key={f} className={`pill ${filter === f ? 'active' : ''}`} onClick={() => setFilter(f)}>
                  {f}
                </button>
              ))}
            </div>
            <div className="field" style={{ margin: 0, minWidth: 240 }}>
              <input
                type="search"
                placeholder="Search by name or location…"
                value={q}
                onChange={e => setQ(e.target.value)}
              />
            </div>
          </div>

          {loading ? (
            <Spinner label="Loading projects…" />
          ) : list.length === 0 ? (
            <Empty title="No projects found">Try a different filter or search term.</Empty>
          ) : (
            <div className="grid grid-3 mt-4">
              {list.map(p => <ProjectCard key={p.id} project={p} />)}
            </div>
          )}
        </div>
      </section>
    </>
  )
}
