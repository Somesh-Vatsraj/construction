export default function Empty({ title = 'Nothing here yet', children }) {
  return (
    <div className="empty">
      <h4>{title}</h4>
      {children && <p style={{ margin: '8px 0 0' }}>{children}</p>}
    </div>
  )
}
