# Admin-Managed Ad Slots Guide

## Overview
Your website now supports **dynamic ad management** from the admin panel. Create, edit, and manage ad slots without touching code. Ads automatically appear on the main site.

## Available Ad Positions
The system supports these pre-defined positions across your site:

| Position | Where it appears | Pages |
|----------|-----------------|-------|
| `header` | Top of page content | Home, Category pages |
| `sidebar` | Side column (mobile only) | Movie detail pages |
| `footer` | Bottom of page content | Home, Category pages |
| `between-movies` | Between movie grid and related movies | Movie detail pages |
| `movie-detail-top` | Top of movie detail page | Movie detail pages |
| `movie-detail-bottom` | Bottom of movie detail page | Movie detail pages |

---

## How to Create an Ad Slot from Admin Panel

### Step 1: Access Admin Panel
1. Go to your admin URL: `https://moviesmodadmin.vercel.app` (or your admin domain)
2. Login with admin credentials

### Step 2: Navigate to Ad Slots
1. From the admin dashboard, click **"Ad Slots"** in the sidebar
2. Click **"Create New Ad Slot"** button

### Step 3: Fill in Ad Slot Details

#### Required Fields:
- **Name**: A descriptive name for this ad slot (e.g., "Category Top Banner", "Movie Detail Sidebar")
- **Position**: Choose from dropdown:
  - `header` - Top of pages
  - `sidebar` - Sidebar (mobile)
  - `footer` - Bottom of pages
  - `between-movies` - Between content on movie pages
  - `movie-detail-top` - Top of movie detail
  - `movie-detail-bottom` - Bottom of movie detail
- **Ad Code**: Paste the full HTML ad code from your ad network

#### Optional Fields:
- **Order**: Number to control display order (lower = shown first)
- **Dimensions**: Set width/height if needed (e.g., "728px" width, "90px" height)
- **Is Active**: Toggle to enable/disable without deleting

### Step 4: Get Your Ad Code

#### For Google AdSense:
1. Go to your [AdSense account](https://www.google.com/adsense)
2. Click **Ads** → **By ad unit**
3. Click on an existing ad unit or create a new one
4. Copy the **full ad code** (should include `<script>` and `<ins>` tags)
5. Paste into the **Ad Code** field

**Example AdSense code:**
```html
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6092854089986939"
     crossorigin="anonymous"></script>
<ins class="adsbygoogle"
     style="display:block"
     data-ad-client="ca-pub-6092854089986939"
     data-ad-slot="1234567890"
     data-ad-format="auto"
     data-full-width-responsive="true"></ins>
<script>
     (adsbygoogle = window.adsbygoogle || []).push({});
</script>
```

#### For Other Ad Networks:
Simply paste the full HTML snippet they provide (e.g., Media.net, PropellerAds, Adsterra, etc.)

### Step 5: Save and Verify
1. Click **"Create Ad Slot"** button
2. Ensure **"Is Active"** is checked
3. Go to your main website and refresh the relevant page
4. The ad should appear automatically in the specified position

---

## Managing Existing Ad Slots

### Edit an Ad Slot
1. Go to **Ad Slots** in admin panel
2. Click **Edit** button on the slot you want to modify
3. Update any field (name, position, code, dimensions, order)
4. Click **Save Changes**
5. Changes appear immediately on the main site

### Disable an Ad Slot (without deleting)
1. Go to **Ad Slots**
2. Find the slot you want to disable
3. Toggle **"Is Active"** to OFF
4. Ad will stop showing on the main site immediately

### Delete an Ad Slot
1. Go to **Ad Slots**
2. Click **Delete** button on the slot
3. Confirm deletion
4. Ad is permanently removed

### Change Display Order
1. Edit the ad slot
2. Change the **Order** field (lower numbers display first)
3. If multiple ads exist for the same position, they'll stack in order

---

## API Endpoints (for developers)

### Public Endpoint (no auth required)
```
GET /api/ad-slots
GET /api/ad-slots?position=header
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "name": "Category Top Banner",
      "position": "header",
      "adCode": "<script>...</script>",
      "dimensions": { "width": "728px", "height": "90px" },
      "order": 1
    }
  ]
}
```

### Admin Endpoints (auth required)
```
GET /api/admin/ad-slots          - List all ad slots
POST /api/admin/ad-slots         - Create new ad slot
PUT /api/admin/ad-slots/:id      - Update ad slot
DELETE /api/admin/ad-slots/:id   - Delete ad slot
```

---

## Troubleshooting

### Ad not showing on the site?
1. **Check if slot is active**: Go to admin panel, ensure "Is Active" is ON
2. **Check position name**: Must match exactly: `header`, `footer`, `sidebar`, etc.
3. **Clear browser cache**: Hard refresh (Ctrl+Shift+R / Cmd+Shift+R)
4. **Check ad code**: Make sure HTML is complete and not broken
5. **Check console**: Open DevTools → Console for errors
6. **Backend running**: Ensure backend API is deployed and accessible

### Ad shows but content is blocked?
- **Ad blocker**: Disable browser ad blockers or test in incognito mode
- **AdSense policy**: If using AdSense, ensure domain is approved and ads policy-compliant
- **HTTPS**: AdSense requires HTTPS; ensure site is on `https://`

### Multiple ads showing in same position?
- This is normal if you created multiple slots for the same position
- To show only one, either:
  - Delete extra slots, or
  - Set "Is Active" to OFF on extras, or
  - Use different positions

### Ad code not rendering properly?
- Make sure you pasted the **complete** ad code including all `<script>` tags
- Some ad networks require initialization scripts; include those too
- Check for syntax errors in the HTML

---

## Best Practices

1. **Use descriptive names**: "Home Header Banner" instead of "Ad 1"
2. **Test on multiple devices**: Check mobile, tablet, desktop views
3. **Don't overload**: Too many ads hurt user experience
4. **Monitor performance**: Use your ad network's dashboard to track earnings
5. **A/B test positions**: Try different positions to see what performs best
6. **Keep backup**: Save ad codes externally before making big changes

---

## Current Environment Variables

Make sure these are set in your deployment:

### Backend (`.env`)
```env
MONGODB_URI=mongodb+srv://...
FRONTEND_URL=https://moviesmod-virid.vercel.app
ADMIN_URL=https://moviesmodadmin.vercel.app
```

### Website (`.env.local`)
```env
NEXT_PUBLIC_API_URL=https://apimoviesmod.vercel.app/api
NEXT_PUBLIC_ADSENSE_CLIENT_ID=ca-pub-6092854089986939
```

### Admin (`.env.local`)
```env
NEXT_PUBLIC_API_URL=https://apimoviesmod.vercel.app/api
```

---

## Summary

✅ **Backend**: Public API endpoint `/api/ad-slots` to fetch active slots  
✅ **Website**: `AdSlotRenderer` component dynamically fetches and displays ads  
✅ **Admin**: CRUD endpoints to manage ad slots (create, update, delete)  
✅ **Positions**: 6 predefined positions across home, category, and movie pages  

**Result**: Create ads from admin panel → They auto-appear on the main site! 🎉
