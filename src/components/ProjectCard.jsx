import { Link } from 'react-router-dom'

export default function ProjectCard({ project }) {
  const p = project
  return (
    <Link to={`/projects/${p.slug}`} className="project-card">
      <div className="project-card-img">
        {p.main_image && <img src={p.main_image} alt={p.name} loading="lazy" />}
        {p.status && (
          <span className={`project-card-status ${p.status.toLowerCase()}`}>{p.status}</span>
        )}
      </div>
      <div className="project-card-body">
        <div className="project-card-loc">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
          {p.location}
        </div>
        {p.property_type && <div className="project-type">{p.property_type}</div>}
        <h3>{p.name}</h3>
        <p>{p.short_description}</p>
        <span className="project-card-cta">
          View Project
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M13 5l7 7-7 7"/></svg>
        </span>
      </div>
    </Link>
  )
}
