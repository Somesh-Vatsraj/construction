import SEO from '../components/SEO.jsx'
import { useSite } from '../context/SiteContext.jsx'

export default function Terms() {
  const { site } = useSite()
  return (
    <>
      <SEO title="Terms & Conditions — MJ Developers" description="MJ Developers terms and conditions." canonical={`${site?.settings?.siteUrl}/terms`} />
      <section className="section" style={{ paddingTop: 140 }}>
        <div className="container-narrow">
          <h1>Terms &amp; Conditions</h1>
          <p className="lead">By using this website, you agree to the following terms.</p>
          <h2 className="mt-4">Website Content</h2>
          <p>All content on this website is for informational purposes. Project details, prices and availability may change without notice.</p>
          <h2>Enquiries</h2>
          <p>Submitting an enquiry does not create a binding contract. Our team will contact you for further discussion.</p>
          <h2>Images</h2>
          <p>Some images may be representative or artistic impressions. Please verify specifications directly with our team.</p>
        </div>
      </section>
    </>
  )
}
