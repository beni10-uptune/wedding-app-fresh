export default function CookiePolicyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-pink-50 py-12">
      <div className="max-w-4xl mx-auto px-6">
        <h1 className="text-4xl font-bold mb-8 text-gray-900">Cookie Policy</h1>
        
        <div className="prose prose-gray max-w-none">
          <p className="text-gray-600 mb-6">
            Last updated: {new Date().toLocaleDateString('en-GB', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">1. What Are Cookies</h2>
            <p className="mb-4">
              Cookies are small text files placed on your device when you visit our website. 
              They help us provide you with a better experience by remembering your preferences, 
              analyzing how you use our site, and enabling certain features.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">2. How We Use Cookies</h2>
            <p className="mb-4">We use cookies for the following purposes:</p>
            <ul className="list-disc pl-6 mb-4">
              <li><strong>Essential Cookies:</strong> Required for the website to function properly</li>
              <li><strong>Analytics Cookies:</strong> Help us understand how visitors use our site</li>
              <li><strong>Preference Cookies:</strong> Remember your settings and choices</li>
              <li><strong>Marketing Cookies:</strong> Track the effectiveness of our advertising</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">3. Cookies We Use</h2>
            
            <h3 className="text-xl font-semibold mb-3">Essential Cookies</h3>
            <div className="overflow-x-auto mb-6">
              <table className="min-w-full bg-white border rounded-lg">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left">Cookie Name</th>
                    <th className="px-4 py-2 text-left">Provider</th>
                    <th className="px-4 py-2 text-left">Purpose</th>
                    <th className="px-4 py-2 text-left">Duration</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border-t px-4 py-2">__session</td>
                    <td className="border-t px-4 py-2">Firebase Auth</td>
                    <td className="border-t px-4 py-2">User authentication</td>
                    <td className="border-t px-4 py-2">Session</td>
                  </tr>
                  <tr>
                    <td className="border-t px-4 py-2">cookieConsent</td>
                    <td className="border-t px-4 py-2">UpTune</td>
                    <td className="border-t px-4 py-2">Remember cookie preferences</td>
                    <td className="border-t px-4 py-2">1 year</td>
                  </tr>
                  <tr>
                    <td className="border-t px-4 py-2">stripe_sid</td>
                    <td className="border-t px-4 py-2">Stripe</td>
                    <td className="border-t px-4 py-2">Payment processing security</td>
                    <td className="border-t px-4 py-2">30 minutes</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h3 className="text-xl font-semibold mb-3">Analytics Cookies</h3>
            <div className="overflow-x-auto mb-6">
              <table className="min-w-full bg-white border rounded-lg">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left">Cookie Name</th>
                    <th className="px-4 py-2 text-left">Provider</th>
                    <th className="px-4 py-2 text-left">Purpose</th>
                    <th className="px-4 py-2 text-left">Duration</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border-t px-4 py-2">_ga</td>
                    <td className="border-t px-4 py-2">Google Analytics</td>
                    <td className="border-t px-4 py-2">Distinguish unique users</td>
                    <td className="border-t px-4 py-2">2 years</td>
                  </tr>
                  <tr>
                    <td className="border-t px-4 py-2">_gid</td>
                    <td className="border-t px-4 py-2">Google Analytics</td>
                    <td className="border-t px-4 py-2">Distinguish unique users</td>
                    <td className="border-t px-4 py-2">24 hours</td>
                  </tr>
                  <tr>
                    <td className="border-t px-4 py-2">_gat_gtag_*</td>
                    <td className="border-t px-4 py-2">Google Analytics</td>
                    <td className="border-t px-4 py-2">Throttle request rate</td>
                    <td className="border-t px-4 py-2">1 minute</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h3 className="text-xl font-semibold mb-3">Third-Party Cookies</h3>
            <p className="mb-4">
              When you connect your Spotify account or use embedded content, third-party services 
              may set their own cookies. Please refer to their privacy policies:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li><a href="https://www.spotify.com/privacy" className="text-purple-600 hover:underline">Spotify Privacy Policy</a></li>
              <li><a href="https://stripe.com/privacy" className="text-purple-600 hover:underline">Stripe Privacy Policy</a></li>
              <li><a href="https://policies.google.com/privacy" className="text-purple-600 hover:underline">Google Privacy Policy</a></li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">4. Managing Cookies</h2>
            <p className="mb-4">
              You can control cookies through our cookie consent banner when you first visit our site. 
              You can also manage cookies through your browser settings:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li><a href="https://support.google.com/chrome/answer/95647" className="text-purple-600 hover:underline">Chrome</a></li>
              <li><a href="https://support.mozilla.org/en-US/kb/enhanced-tracking-protection-firefox-desktop" className="text-purple-600 hover:underline">Firefox</a></li>
              <li><a href="https://support.apple.com/guide/safari/manage-cookies-and-website-data-sfri11471/mac" className="text-purple-600 hover:underline">Safari</a></li>
              <li><a href="https://support.microsoft.com/en-us/windows/manage-cookies-in-microsoft-edge-168dab11-0753-043d-7c16-ede5947fc64d" className="text-purple-600 hover:underline">Edge</a></li>
            </ul>
            <p className="mb-4">
              Note: Blocking essential cookies may prevent you from using certain features of our website, 
              such as staying logged in or making payments.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">5. Changes to This Policy</h2>
            <p className="mb-4">
              We may update this Cookie Policy from time to time. We will notify you of any 
              changes by posting the new Cookie Policy on this page and updating the "Last updated" date.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">6. Contact Us</h2>
            <p className="mb-4">
              If you have questions about our use of cookies, please contact us:
            </p>
            <div className="bg-gray-100 p-4 rounded-lg">
              <p className="mb-2"><strong>Email:</strong> privacy@uptune.xyz</p>
              <p><strong>Address:</strong> UpTune Ltd, London, United Kingdom</p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">7. More Information</h2>
            <p className="mb-4">
              For more information about cookies and how they work, visit:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li><a href="https://ico.org.uk/for-the-public/online/cookies/" className="text-purple-600 hover:underline">ICO Guide to Cookies</a></li>
              <li><a href="https://www.allaboutcookies.org/" className="text-purple-600 hover:underline">All About Cookies</a></li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  )
}