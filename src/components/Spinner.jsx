export default function Spinner({ label = 'Loading…' }) {
  return (
    <div className="loading-wrap">
      <span className="loader" aria-hidden="true" />
      <span>{label}</span>
    </div>
  )
}
