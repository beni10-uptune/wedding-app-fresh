# Complete GTM, GA4, and Google Ads Setup Guide for UpTune Wedding App

## Overview
This guide shows exactly what needs to be configured in Google Tag Manager (GTM), Google Analytics 4 (GA4), and Google Ads to track all events properly.

## Prerequisites
- GTM Container ID: `GTM-NJP3X5W3`
- GA4 Property (you need to create this if not already done)
- Google Ads Account ID: `AW-17431723327`

---

## Step 1: Google Analytics 4 Setup

### 1.1 Create GA4 Property (if not already done)
1. Go to Google Analytics
2. Admin → Create Property
3. Name it "UpTune Wedding Platform"
4. Set up data stream for `weddings.uptune.xyz`
5. Copy your Measurement ID (format: `G-XXXXXXXXXX`)

### 1.2 Mark Conversions in GA4
Navigate to Admin → Events → Mark as conversions for:
- `sign_up`
- `purchase`
- `create_wedding`
- `export_playlist`

---

## Step 2: Google Tag Manager Configuration

### 2.1 Variables to Create

Go to Variables → User-Defined Variables → New

#### Built-in Variables to Enable:
- Click URL
- Click Classes
- Click ID
- Click Text
- Page URL
- Page Path
- Referrer

#### Custom Variables to Create:

1. **DLV - Event Method**
   - Variable Type: Data Layer Variable
   - Data Layer Variable Name: `method`

2. **DLV - Wedding ID**
   - Variable Type: Data Layer Variable
   - Data Layer Variable Name: `wedding_id`

3. **DLV - Transaction ID**
   - Variable Type: Data Layer Variable
   - Data Layer Variable Name: `transaction_id`

4. **DLV - Value**
   - Variable Type: Data Layer Variable
   - Data Layer Variable Name: `value`

5. **DLV - Currency**
   - Variable Type: Data Layer Variable
   - Data Layer Variable Name: `currency`

6. **DLV - Search Term**
   - Variable Type: Data Layer Variable
   - Data Layer Variable Name: `search_term`

7. **DLV - Song Title**
   - Variable Type: Data Layer Variable
   - Data Layer Variable Name: `song_title`

8. **DLV - Wedding Moment**
   - Variable Type: Data Layer Variable
   - Data Layer Variable Name: `wedding_moment`

9. **DLV - Items**
   - Variable Type: Data Layer Variable
   - Data Layer Variable Name: `items`

10. **DLV - Platform**
    - Variable Type: Data Layer Variable
    - Data Layer Variable Name: `platform`

### 2.2 Triggers to Create

Go to Triggers → New

1. **Trigger - Sign Up**
   - Trigger Type: Custom Event
   - Event name: `sign_up`

2. **Trigger - Login**
   - Trigger Type: Custom Event
   - Event name: `login`

3. **Trigger - Purchase**
   - Trigger Type: Custom Event
   - Event name: `purchase`

4. **Trigger - Begin Checkout**
   - Trigger Type: Custom Event
   - Event name: `begin_checkout`

5. **Trigger - Create Wedding**
   - Trigger Type: Custom Event
   - Event name: `create_wedding`

6. **Trigger - Search Song**
   - Trigger Type: Custom Event
   - Event name: `search_song`

7. **Trigger - Add Song**
   - Trigger Type: Custom Event
   - Event name: `add_song`

8. **Trigger - Export Playlist**
   - Trigger Type: Custom Event
   - Event name: `export_playlist`

9. **Trigger - Read Article**
   - Trigger Type: Custom Event
   - Event name: `read_article`

### 2.3 Tags to Create

Go to Tags → New

#### GA4 Configuration Tag
1. **Tag: GA4 Configuration**
   - Tag Type: Google Analytics: GA4 Configuration
   - Measurement ID: `G-XXXXXXXXXX` (your GA4 ID)
   - Trigger: All Pages

#### GA4 Event Tags

2. **Tag: GA4 - Sign Up**
   - Tag Type: Google Analytics: GA4 Event
   - Configuration Tag: {{GA4 Configuration}}
   - Event Name: `sign_up`
   - Event Parameters:
     - method: {{DLV - Event Method}}
   - Trigger: Trigger - Sign Up

3. **Tag: GA4 - Purchase**
   - Tag Type: Google Analytics: GA4 Event
   - Configuration Tag: {{GA4 Configuration}}
   - Event Name: `purchase`
   - Event Parameters:
     - transaction_id: {{DLV - Transaction ID}}
     - value: {{DLV - Value}}
     - currency: {{DLV - Currency}}
     - items: {{DLV - Items}}
   - Trigger: Trigger - Purchase

4. **Tag: GA4 - Begin Checkout**
   - Tag Type: Google Analytics: GA4 Event
   - Configuration Tag: {{GA4 Configuration}}
   - Event Name: `begin_checkout`
   - Event Parameters:
     - value: {{DLV - Value}}
     - currency: {{DLV - Currency}}
     - items: {{DLV - Items}}
   - Trigger: Trigger - Begin Checkout

5. **Tag: GA4 - Create Wedding**
   - Tag Type: Google Analytics: GA4 Event
   - Configuration Tag: {{GA4 Configuration}}
   - Event Name: `create_wedding`
   - Event Parameters:
     - wedding_id: {{DLV - Wedding ID}}
   - Trigger: Trigger - Create Wedding

6. **Tag: GA4 - Search Song**
   - Tag Type: Google Analytics: GA4 Event
   - Configuration Tag: {{GA4 Configuration}}
   - Event Name: `search`
   - Event Parameters:
     - search_term: {{DLV - Search Term}}
   - Trigger: Trigger - Search Song

7. **Tag: GA4 - Add Song**
   - Tag Type: Google Analytics: GA4 Event
   - Configuration Tag: {{GA4 Configuration}}
   - Event Name: `add_to_wishlist`
   - Event Parameters:
     - items: [{
       item_name: {{DLV - Song Title}},
       item_category: {{DLV - Wedding Moment}}
     }]
   - Trigger: Trigger - Add Song

#### Google Ads Conversion Tags

8. **Tag: Google Ads - Sign Up Conversion**
   - Tag Type: Google Ads Conversion Tracking
   - Conversion ID: `17431723327`
   - Conversion Label: `d46hCMqE5f4aEL_6i_hA`
   - Conversion Value: 0 (or set a value)
   - Trigger: Trigger - Sign Up

9. **Tag: Google Ads - Purchase Conversion**
   - Tag Type: Google Ads Conversion Tracking
   - Conversion ID: `17431723327`
   - Conversion Label: `ohB-CJnk8_4aEL_6i_hA`
   - Conversion Value: {{DLV - Value}}
   - Currency Code: {{DLV - Currency}}
   - Transaction ID: {{DLV - Transaction ID}}
   - Trigger: Trigger - Purchase

10. **Tag: Google Ads Remarketing**
    - Tag Type: Google Ads Remarketing
    - Conversion ID: `17431723327`
    - Trigger: All Pages

---

## Step 3: Enhanced Ecommerce Setup

For proper ecommerce tracking:

### 3.1 Update Purchase Tag
Add these parameters to the GA4 Purchase tag:
- tax: 0
- shipping: 0
- affiliation: "UpTune Wedding Platform"

### 3.2 Create Additional Ecommerce Tags
- **view_item**: When users view pricing
- **add_to_cart**: When users click "Get Started"
- **remove_from_cart**: If users cancel

---

## Step 4: Custom Dimensions in GA4

Go to GA4 → Admin → Custom definitions → Create custom dimension:

1. **Wedding ID**
   - Dimension name: Wedding ID
   - Scope: Event
   - Event parameter: wedding_id

2. **Wedding Moment**
   - Dimension name: Wedding Moment
   - Scope: Event
   - Event parameter: wedding_moment

3. **Platform**
   - Dimension name: Export Platform
   - Scope: Event
   - Event parameter: platform

---

## Step 5: Testing Your Setup

### 5.1 GTM Preview Mode
1. In GTM, click "Preview"
2. Enter your website URL
3. Perform actions (sign up, search, etc.)
4. Check that events fire in the preview panel

### 5.2 GA4 DebugView
1. In GA4, go to Admin → DebugView
2. With GTM Preview active, events should appear in real-time

### 5.3 Google Tag Assistant
1. Install Google Tag Assistant Chrome extension
2. Navigate your site
3. Verify all tags fire correctly

---

## Step 6: Google Ads Setup

### 6.1 Import GA4 Conversions
1. Google Ads → Tools → Conversions
2. Click "+ New conversion"
3. Select "Import" → "Google Analytics 4"
4. Import: sign_up, purchase, create_wedding

### 6.2 Set Conversion Values
- Sign Up: £5-10 (estimated lead value)
- Purchase: Actual transaction value
- Create Wedding: £2-5 (micro-conversion)

### 6.3 Create Audiences
1. Google Ads → Tools → Audience Manager
2. Create audiences:
   - "Signed Up Users" (based on sign_up event)
   - "Purchasers" (based on purchase event)
   - "Active Wedding Planners" (based on add_song events)

---

## Step 7: Additional Tracking to Implement

### 7.1 Blog Engagement
Create tags for:
- Scroll depth (25%, 50%, 75%, 100%)
- Time on page
- Newsletter signups

### 7.2 Feature Usage
Track when users:
- Use AI recommendations
- Export to Spotify
- Share wedding link
- Add collaborators

---

## Step 8: Data Layer Push Examples

Here's what the code is pushing to dataLayer:

```javascript
// Sign Up
dataLayer.push({
  event: 'sign_up',
  method: 'email' // or 'google'
});

// Purchase
dataLayer.push({
  event: 'purchase',
  transaction_id: 'wedding_abc123',
  value: 29.99,
  currency: 'GBP',
  items: [{
    item_name: 'UpTune Wedding Music Platform',
    price: 29.99,
    quantity: 1
  }]
});

// Song Search
dataLayer.push({
  event: 'search_song',
  search_term: 'perfect ed sheeran'
});
```

---

## Quick Checklist

- [ ] GA4 property created and configured
- [ ] GTM container has GA4 Configuration tag
- [ ] All custom variables created in GTM
- [ ] All triggers created in GTM
- [ ] GA4 event tags created and linked to triggers
- [ ] Google Ads conversion tags created
- [ ] Conversions marked in GA4
- [ ] Conversions imported to Google Ads
- [ ] Preview mode tested
- [ ] DebugView shows events in GA4

---

## Need More Events Tracked?

The following events are defined in code but not yet implemented:
- logout
- invite_guest
- invite_co_owner
- remove_song
- refund
- newsletter_signup
- use_feature
- tutorial_complete

Let me know if you want these implemented in the application code!