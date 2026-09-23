import SEO from '../components/SEO.jsx'
import { useSite } from '../context/SiteContext.jsx'

export default function Privacy() {
  const { site } = useSite()
  return (
    <>
      <SEO title="Privacy Policy — MJ Developers" description="MJ Developers privacy policy." canonical={`${site?.settings?.siteUrl}/privacy`} />
      <section className="section" style={{ paddingTop: 140 }}>
        <div className="container-narrow">
          <h1>Privacy Policy</h1>
          <p className="lead">We respect your privacy and are committed to protecting your personal data.</p>
          <h2 className="mt-4">Information We Collect</h2>
          <p>We collect only the information you provide through enquiry and site-visit forms — such as your name, phone number, email address and message.</p>
          <h2>How We Use It</h2>
          <p>Your information is used solely to respond to your enquiry and to communicate about our projects. We never sell your data.</p>
          <h2>Contact</h2>
          <p>For any privacy-related questions, please contact us through the details on our Contact page.</p>
        </div>
      </section>
    </>
  )
}
