import Link from 'next/link'

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-pink-50 py-12">
      <div className="max-w-4xl mx-auto px-6">
        <h1 className="text-4xl font-bold mb-8 text-gray-900">Privacy Policy</h1>
        
        <div className="prose prose-gray max-w-none">
          <p className="text-gray-600 mb-6">
            Last updated: {new Date().toLocaleDateString('en-GB', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
            <p className="mb-4">
              UpTune for Weddings ("we", "our", or "us") is committed to protecting your privacy. 
              This Privacy Policy explains how we collect, use, disclose, and safeguard your information 
              when you use our wedding music planning platform at weddings.uptune.xyz.
            </p>
            <p className="mb-4">
              We comply with the UK General Data Protection Regulation (UK GDPR) and the Data Protection 
              Act 2018. By using our service, you consent to the data practices described in this policy.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">2. Information We Collect</h2>
            
            <h3 className="text-xl font-semibold mb-3">Personal Information</h3>
            <ul className="list-disc pl-6 mb-4">
              <li>Name and email address (when you create an account)</li>
              <li>Wedding details (date, venue, couple names)</li>
              <li>Payment information (processed securely via Stripe)</li>
              <li>Music preferences and playlist data</li>
              <li>Guest information (names and emails for invitations)</li>
            </ul>

            <h3 className="text-xl font-semibold mb-3">Automatically Collected Information</h3>
            <ul className="list-disc pl-6 mb-4">
              <li>IP address and device information</li>
              <li>Browser type and operating system</li>
              <li>Pages visited and time spent on our platform</li>
              <li>Referring website addresses</li>
              <li>Cookies and usage data (see our <Link href="/cookies" className="text-purple-600 hover:underline">Cookie Policy</Link>)</li>
            </ul>

            <h3 className="text-xl font-semibold mb-3">Third-Party Data</h3>
            <ul className="list-disc pl-6 mb-4">
              <li>Spotify account information (if you connect your account)</li>
              <li>Song metadata from Spotify's API</li>
              <li>Social authentication data (if you use social login)</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">3. Legal Basis for Processing</h2>
            <p className="mb-4">We process your personal data under the following legal bases:</p>
            <ul className="list-disc pl-6 mb-4">
              <li><strong>Contract:</strong> To provide our wedding music planning services</li>
              <li><strong>Consent:</strong> For marketing communications and analytics cookies</li>
              <li><strong>Legitimate Interests:</strong> To improve our service and prevent fraud</li>
              <li><strong>Legal Obligation:</strong> To comply with applicable laws and regulations</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">4. How We Use Your Information</h2>
            <ul className="list-disc pl-6 mb-4">
              <li>Provide and maintain our wedding music planning service</li>
              <li>Process payments and send transaction receipts</li>
              <li>Send service-related emails (account confirmation, password reset)</li>
              <li>Enable collaboration between wedding partners and guests</li>
              <li>Generate music recommendations based on your preferences</li>
              <li>Improve our service through analytics and feedback</li>
              <li>Comply with legal obligations</li>
              <li>Send marketing communications (with your consent)</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">5. Data Sharing and Disclosure</h2>
            <p className="mb-4">We share your information only in the following circumstances:</p>
            
            <h3 className="text-xl font-semibold mb-3">Service Providers</h3>
            <ul className="list-disc pl-6 mb-4">
              <li><strong>Stripe:</strong> Payment processing</li>
              <li><strong>Firebase (Google):</strong> Database and authentication</li>
              <li><strong>Vercel:</strong> Website hosting</li>
              <li><strong>Spotify:</strong> Music data and playlist creation</li>
              <li><strong>Resend:</strong> Email delivery</li>
              <li><strong>Google Analytics:</strong> Website analytics (with consent)</li>
            </ul>

            <h3 className="text-xl font-semibold mb-3">Other Sharing</h3>
            <ul className="list-disc pl-6 mb-4">
              <li>With your wedding co-owner(s) and invited guests (as you direct)</li>
              <li>When required by law or to respond to legal process</li>
              <li>To protect our rights, privacy, safety, or property</li>
              <li>In connection with a business transfer or acquisition</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">6. Data Retention</h2>
            <p className="mb-4">We retain your personal data for different periods depending on the type:</p>
            <ul className="list-disc pl-6 mb-4">
              <li><strong>Account data:</strong> Until you delete your account</li>
              <li><strong>Wedding data:</strong> 2 years after your wedding date</li>
              <li><strong>Payment records:</strong> 7 years for tax compliance</li>
              <li><strong>Analytics data:</strong> 26 months</li>
              <li><strong>Marketing data:</strong> Until you unsubscribe</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">7. Your Rights</h2>
            <p className="mb-4">Under UK GDPR, you have the following rights:</p>
            <ul className="list-disc pl-6 mb-4">
              <li><strong>Access:</strong> Request a copy of your personal data</li>
              <li><strong>Rectification:</strong> Correct inaccurate or incomplete data</li>
              <li><strong>Erasure:</strong> Request deletion of your data ("right to be forgotten")</li>
              <li><strong>Restriction:</strong> Limit how we process your data</li>
              <li><strong>Portability:</strong> Receive your data in a portable format</li>
              <li><strong>Object:</strong> Object to certain types of processing</li>
              <li><strong>Withdraw consent:</strong> Withdraw consent at any time</li>
            </ul>
            <p className="mb-4">
              To exercise these rights, please use our <Link href="/contact" className="text-purple-600 hover:underline">contact form</Link> and select "Privacy Concern" as the category. We will respond within 30 days.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">8. Data Security</h2>
            <p className="mb-4">
              We implement appropriate technical and organisational measures to protect your data:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>Encryption in transit (HTTPS) and at rest</li>
              <li>Regular security assessments and updates</li>
              <li>Access controls and authentication</li>
              <li>Secure payment processing via Stripe</li>
              <li>Regular backups and disaster recovery procedures</li>
            </ul>
            <p className="mb-4">
              However, no method of transmission over the internet is 100% secure. While we strive 
              to protect your data, we cannot guarantee absolute security.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">9. International Transfers</h2>
            <p className="mb-4">
              Your data may be transferred to and processed in countries outside the UK/EEA. 
              We ensure appropriate safeguards are in place, including:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>Standard contractual clauses approved by the UK ICO</li>
              <li>Adequacy decisions for certain countries</li>
              <li>Your explicit consent where required</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">10. Children's Privacy</h2>
            <p className="mb-4">
              Our service is not intended for children under 18. We do not knowingly collect 
              personal data from children. If you believe we have collected data from a child, 
              please contact us immediately.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">11. Changes to This Policy</h2>
            <p className="mb-4">
              We may update this Privacy Policy from time to time. We will notify you of any 
              changes by posting the new Privacy Policy on this page and updating the "Last updated" 
              date. For material changes, we will provide additional notice via email.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">12. Contact Information</h2>
            <p className="mb-4">For questions about this Privacy Policy or our data practices, please use our <Link href="/contact" className="text-purple-600 hover:underline">contact form</Link>.</p>
            <div className="bg-gray-100 p-4 rounded-lg">
              <p className="mb-2"><strong>Company:</strong> UpTune Ltd</p>
              <p className="mb-2"><strong>Location:</strong> London, United Kingdom</p>
              <p className="mb-2"><strong>Data Protection Inquiries:</strong> Use our <Link href="/contact" className="text-purple-600 hover:underline">contact form</Link> and select "Privacy Concern"</p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">13. Supervisory Authority</h2>
            <p className="mb-4">
              You have the right to lodge a complaint with the Information Commissioner's Office (ICO):
            </p>
            <div className="bg-gray-100 p-4 rounded-lg">
              <p className="mb-2"><strong>Website:</strong> <a href="https://ico.org.uk" className="text-purple-600 hover:underline">ico.org.uk</a></p>
              <p className="mb-2"><strong>Phone:</strong> 0303 123 1113</p>
              <p><strong>Address:</strong> Information Commissioner's Office, Wycliffe House, Water Lane, Wilmslow, Cheshire, SK9 5AF</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}