'use client'

import Script from 'next/script'
import { initializeGoogleAds, GOOGLE_ADS_ID } from '@/lib/google-ads'

export function GoogleAdsScript() {
  return (
    <>
      {/* Global site tag (gtag.js) - Google Ads */}
      <Script
        id="google-ads-script"
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${GOOGLE_ADS_ID}`}
      />
      <Script
        id="google-ads-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            window.gtag = gtag;
            gtag('js', new Date());
            
            // Check for cookie consent before configuring
            const consent = localStorage.getItem('cookieConsent');
            if (consent === 'true') {
              gtag('config', '${GOOGLE_ADS_ID}', {
                allow_enhanced_conversions: true
              });
            }
          `,
        }}
        onLoad={() => {
          // Initialize Google Ads after script loads
          const consent = localStorage.getItem('cookieConsent')
          if (consent === 'true') {
            initializeGoogleAds()
          }
        }}
      />
    </>
  )
}