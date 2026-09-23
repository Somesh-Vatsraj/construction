import { useSite } from '../context/SiteContext.jsx'
import { whatsappLink } from '../utils/format.js'

export default function FloatingContact() {
  const { site } = useSite()
  const c = site?.contact || {}
  if (!c.whatsapp && !c.phone) return null

  return (
    <div className="float-contact">
      {c.whatsapp && (
        <a
          className="float-btn whatsapp"
          href={whatsappLink(c.whatsapp, 'Hello MJ Developers, I would like to know more about your projects.')}
          target="_blank"
          rel="noreferrer noopener"
          aria-label="Chat on WhatsApp"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M20 3.9A10 10 0 003.5 17.5L2 22l4.6-1.4A10 10 0 1020 3.9zm-8 16.4a8.4 8.4 0 01-4.3-1.2l-.3-.2-2.7.8.8-2.7-.2-.3a8.4 8.4 0 1117 0 8.4 8.4 0 01-8.3 8.4zm4.6-6.3c-.3-.1-1.5-.7-1.7-.8s-.4-.1-.6.1-.7.8-.8 1-.3.2-.6.1a7 7 0 01-2-1.2 7.6 7.6 0 01-1.4-1.7c-.1-.3 0-.4.1-.6l.4-.5.3-.5v-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 00-.7.3 3 3 0 00-.9 2.2c0 1.3.9 2.5 1 2.7s1.8 2.8 4.3 3.9c.6.3 1 .4 1.4.5a3.4 3.4 0 001.5.1c.5-.1 1.5-.6 1.7-1.2s.2-1.1.2-1.2l-.1-.1z"/></svg>
        </a>
      )}
      {c.phone && (
        <a className="float-btn call" href={`tel:${c.phone}`} aria-label="Call us">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M22 16.9v3a2 2 0 01-2.2 2 19.8 19.8 0 01-8.6-3.1 19.5 19.5 0 01-6-6A19.8 19.8 0 012.1 4.2 2 2 0 014.1 2h3a2 2 0 012 1.7c.1 1 .4 1.9.7 2.8a2 2 0 01-.5 2.1L8 10a16 16 0 006 6l1.4-1.3a2 2 0 012.1-.5c.9.3 1.8.6 2.8.7a2 2 0 011.7 2z"/></svg>
        </a>
      )}
    </div>
  )
}
