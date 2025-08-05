# GTM Quick Setup - Essential Conversions Only

## 🎯 Priority 1: Core Conversion Tracking

These are the MUST-HAVE tags for tracking your main conversions:

### Step 1: Create Variables in GTM

| Variable Name | Variable Type | Data Layer Variable Name |
|--------------|---------------|-------------------------|
| DLV - Value | Data Layer Variable | value |
| DLV - Transaction ID | Data Layer Variable | transaction_id |
| DLV - Method | Data Layer Variable | method |

### Step 2: Create Triggers in GTM

| Trigger Name | Trigger Type | Event Name |
|-------------|--------------|------------|
| Sign Up Event | Custom Event | sign_up |
| Purchase Event | Custom Event | purchase |

### Step 3: Create Tags in GTM

#### 3.1 GA4 Configuration Tag (REQUIRED FIRST)
- **Tag Type**: Google Analytics: GA4 Configuration
- **Measurement ID**: Your GA4 ID (G-XXXXXXXXXX)
- **Trigger**: All Pages

#### 3.2 Sign Up Conversion Tags

**GA4 Sign Up Tag:**
- **Tag Type**: Google Analytics: GA4 Event
- **Configuration Tag**: Select your GA4 Configuration tag
- **Event Name**: sign_up
- **Event Parameters**:
  - method: {{DLV - Method}}
- **Trigger**: Sign Up Event

**Google Ads Sign Up Conversion:**
- **Tag Type**: Google Ads Conversion Tracking
- **Conversion ID**: 17431723327
- **Conversion Label**: d46hCMqE5f4aEL_6i_hA
- **Trigger**: Sign Up Event

#### 3.3 Purchase Conversion Tags

**GA4 Purchase Tag:**
- **Tag Type**: Google Analytics: GA4 Event
- **Configuration Tag**: Select your GA4 Configuration tag
- **Event Name**: purchase
- **Event Parameters**:
  - transaction_id: {{DLV - Transaction ID}}
  - value: {{DLV - Value}}
  - currency: GBP
- **Trigger**: Purchase Event

**Google Ads Purchase Conversion:**
- **Tag Type**: Google Ads Conversion Tracking
- **Conversion ID**: 17431723327
- **Conversion Label**: ohB-CJnk8_4aEL_6i_hA
- **Conversion Value**: {{DLV - Value}}
- **Transaction ID**: {{DLV - Transaction ID}}
- **Trigger**: Purchase Event

---

## 🔍 How to Test

1. **Open GTM Preview Mode**
   - Click "Preview" in GTM
   - Enter: https://weddings.uptune.xyz

2. **Test Sign Up**
   - Go to sign up page
   - Complete registration
   - Check Preview: You should see "sign_up" event

3. **Test Purchase** (if possible)
   - Complete a test purchase
   - Check Preview: You should see "purchase" event

---

## ✅ Quick Verification Checklist

In GTM Preview, when you sign up, you should see:
- [ ] `sign_up` event fires
- [ ] `method` variable contains "email" or "google"
- [ ] GA4 tag fires
- [ ] Google Ads conversion tag fires

When a purchase completes, you should see:
- [ ] `purchase` event fires
- [ ] `value` variable contains price (e.g., 29.99)
- [ ] `transaction_id` contains wedding ID
- [ ] GA4 tag fires
- [ ] Google Ads conversion tag fires

---

## 📊 In Google Analytics 4

After setup, go to:
1. **Realtime Report** - You should see events immediately
2. **Events Report** - Within 24 hours
3. **Conversions** - Mark sign_up and purchase as conversions

---

## 🎯 In Google Ads

1. Wait 24 hours for data
2. Check Conversions report
3. You should see:
   - Sign-up conversions
   - Purchase conversions with values

---

## ⚠️ Common Issues

**"Tag not firing"**
- Check trigger event name matches exactly
- Check cookie consent is accepted
- Use GTM Preview mode

**"No data in GA4"**
- Verify GA4 Measurement ID is correct
- Check GA4 Configuration tag fires on all pages
- Wait up to 24 hours for data

**"Google Ads conversions not showing"**
- Verify conversion ID and label are exact
- Check conversion tracking status in Google Ads
- May take 3 hours to appear