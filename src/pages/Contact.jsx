import { useState } from 'react'
import SEO from '../components/SEO.jsx'
import Reveal from '../components/Reveal.jsx'
import { useSite } from '../context/SiteContext.jsx'
import { api } from '../services/api.js'
import { whatsappLink } from '../utils/format.js'

const initial = { name: '', phone: '', email: '', project: '', message: '' }

export default function Contact() {
  const { site } = useSite()
  const c = site?.contact || {}
  const [form, setForm] = useState(initial)
  const [errors, setErrors] = useState({})
  const [state, setState] = useState({ loading: false, success: false, error: '' })

  function validate() {
    const e = {}
    if (!form.name.trim()) e.name = 'Please enter your name'
    if (!form.phone.trim()) e.phone = 'Please enter a phone number'
    else if (!/^[\d+\-\s()]{7,}$/.test(form.phone)) e.phone = 'Enter a valid phone number'
    if (form.email && !/^\S+@\S+\.\S+$/.test(form.email)) e.email = 'Enter a valid email'
    if (!form.message.trim()) e.message = 'Please tell us how we can help'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  async function submit(e) {
    e.preventDefault()
    if (!validate()) return
    setState({ loading: true, success: false, error: '' })
    try {
      await api.createEnquiry(form)
      setState({ loading: false, success: true, error: '' })
      setForm(initial)
    } catch (err) {
      setState({ loading: false, success: false, error: 'Something went wrong. Please try again.' })
    }
  }

  return (
    <>
      <SEO
        title="Contact — MJ Developers"
        description="Get in touch with MJ Developers — request a site visit or send us an enquiry."
        canonical={`${site?.settings?.siteUrl}/contact`}
        structuredData={{
          '@context': 'https://schema.org',
          '@type': 'LocalBusiness',
          name: 'MJ Developers',
          address: c.address,
          telephone: c.phone,
          email: c.email
        }}
      />
      <section className="section" style={{ paddingTop: 140 }}>
        <div className="container">
          <span className="eyebrow">Contact</span>
          <h1>Let's start a conversation.</h1>

          <div className="contact-grid mt-4">
            <div>
              {c.address && (
                <div className="info-item">
                  <div className="info-icon">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
                  </div>
                  <div><h4>Office</h4><p>{c.address}</p></div>
                </div>
              )}
              {c.phone && (
                <div className="info-item">
                  <div className="info-icon">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M22 16.9v3a2 2 0 01-2.2 2 19.8 19.8 0 01-8.6-3.1 19.5 19.5 0 01-6-6A19.8 19.8 0 012.1 4.2 2 2 0 014.1 2h3a2 2 0 012 1.7c.1 1 .4 1.9.7 2.8a2 2 0 01-.5 2.1L8 10a16 16 0 006 6l1.4-1.3a2 2 0 012.1-.5c.9.3 1.8.6 2.8.7a2 2 0 011.7 2z"/></svg>
                  </div>
                  <div><h4>Phone</h4><a href={`tel:${c.phone}`}>{c.phone}</a></div>
                </div>
              )}
              {c.email && (
                <div className="info-item">
                  <div className="info-icon">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M22 6l-10 7L2 6"/></svg>
                  </div>
                  <div><h4>Email</h4><a href={`mailto:${c.email}`}>{c.email}</a></div>
                </div>
              )}
              {c.whatsapp && (
                <div className="info-item">
                  <div className="info-icon">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M20 3.9A10 10 0 003.5 17.5L2 22l4.6-1.4A10 10 0 1020 3.9zM12 20.3a8.4 8.4 0 01-4.3-1.2l-.3-.2-2.7.8.8-2.7-.2-.3a8.4 8.4 0 1117 0 8.4 8.4 0 01-8.3 8.4z"/></svg>
                  </div>
                  <div><h4>WhatsApp</h4>
                    <a href={whatsappLink(c.whatsapp)} target="_blank" rel="noreferrer noopener">{c.whatsapp}</a>
                  </div>
                </div>
              )}
              {c.hours && (
                <div className="info-item">
                  <div className="info-icon">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
                  </div>
                  <div><h4>Working Hours</h4><p>{c.hours}</p></div>
                </div>
              )}
              {c.map_embed && (
                <div className="map-embed" dangerouslySetInnerHTML={{ __html: c.map_embed }} />
              )}
            </div>

            <div>
              <div className="panel" style={{ background: 'var(--surface)' }}>
                <h3 style={{ marginTop: 0 }}>Send an Enquiry</h3>
                {state.success && (
                  <div style={{ padding: 14, background: '#e6f6ec', color: '#2f7a4f', borderRadius: 6, marginBottom: 20, fontSize: 14 }}>
                    Thank you! Your enquiry has been received. Our team will contact you soon.
                  </div>
                )}
                {state.error && (
                  <div style={{ padding: 14, background: '#fbe8e8', color: '#b23b3b', borderRadius: 6, marginBottom: 20, fontSize: 14 }}>
                    {state.error}
                  </div>
                )}
                <form onSubmit={submit} noValidate>
                  <div className="form-row">
                    <div className={`field ${errors.name ? 'invalid' : ''}`}>
                      <label htmlFor="name">Name *</label>
                      <input id="name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
                      {errors.name && <div className="error">{errors.name}</div>}
                    </div>
                    <div className={`field ${errors.phone ? 'invalid' : ''}`}>
                      <label htmlFor="phone">Phone *</label>
                      <input id="phone" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
                      {errors.phone && <div className="error">{errors.phone}</div>}
                    </div>
                  </div>
                  <div className={`field ${errors.email ? 'invalid' : ''}`}>
                    <label htmlFor="email">Email</label>
                    <input id="email" type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
                    {errors.email && <div className="error">{errors.email}</div>}
                  </div>
                  <div className="field">
                    <label htmlFor="project">Interested Project</label>
                    <input id="project" value={form.project} onChange={e => setForm({ ...form, project: e.target.value })} />
                  </div>
                  <div className={`field ${errors.message ? 'invalid' : ''}`}>
                    <label htmlFor="message">Message *</label>
                    <textarea id="message" value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} />
                    {errors.message && <div className="error">{errors.message}</div>}
                  </div>
                  <button type="submit" className="btn btn-primary btn-block" disabled={state.loading}>
                    {state.loading ? 'Sending…' : 'Send Enquiry'}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
