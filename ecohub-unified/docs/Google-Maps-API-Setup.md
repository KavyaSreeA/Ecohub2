# Google Maps API Setup Instructions

## Current Status: ⚠️ API Activation Required

The Google Maps API key is configured but the required APIs need to be enabled in Google Cloud Console.

---

## API Key
```
AIzaSyD-e_4ZAS_9BzyGArjA6rsuC4y_QnwxjHs
```

---

## Required APIs to Enable

Go to [Google Cloud Console - APIs Library](https://console.cloud.google.com/apis/library?filter=category:maps)

Enable these 5 APIs:

| # | API Name | Purpose |
|---|----------|---------|
| 1 | **Maps JavaScript API** | Display interactive maps |
| 2 | **Places API** | Search for EV stations, bike shares, transit |
| 3 | **Directions API** | Route planning & navigation |
| 4 | **Geocoding API** | Address search |
| 5 | **Distance Matrix API** | Distance calculations |

---

## Step-by-Step Instructions

### Step 1: Access Google Cloud Console
1. Go to https://console.cloud.google.com/
2. Sign in with the Google account that owns the API key
3. Select the project associated with the API key

### Step 2: Enable Each API
1. Click **APIs & Services** → **Library**
2. Search for each API name listed above
3. Click on the API
4. Click **Enable**
5. Repeat for all 5 APIs

### Step 3: Verify API Key Restrictions (Optional but Recommended)

1. Go to **APIs & Services** → **Credentials**
2. Click on the API key
3. Under **Application restrictions**:
   - Select "HTTP referrers (web sites)"
   - Add:
     - `localhost:*`
     - `*.ecohub.com`
     - Your production domain
4. Under **API restrictions**:
   - Select "Restrict key"
   - Check all 5 APIs listed above
5. Click **Save**

---

## Testing After Setup

### Test via Terminal:
```bash
curl "https://maps.googleapis.com/maps/api/geocode/json?address=Mumbai&key=AIzaSyD-e_4ZAS_9BzyGArjA6rsuC4y_QnwxjHs"
```

**Expected Response:**
```json
{
  "results": [...],
  "status": "OK"
}
```

### Test in Browser:
1. Navigate to http://localhost:3001/transport
2. Scroll down to "Find Green Transport Near You"
3. Map should load with location search and filters

---

## Features Available Once Enabled

| Feature | Description |
|---------|-------------|
| 🗺️ **Interactive Map** | Full Google Maps on Transport page |
| ⚡ **EV Charging Finder** | Locate nearby charging stations |
| 🚲 **Bike Share Locations** | Find bike rental points |
| 🚌 **Transit Stops** | Bus, metro, train stations |
| 🛣️ **Route Planning** | Directions with multiple transport modes |
| 🌱 **CO₂ Comparison** | Show emissions saved vs driving |

---

## Cost Information

| Tier | Details |
|------|---------|
| **Free Tier** | $200/month credit (covers ~28,000 map loads) |
| **Pay-as-you-go** | $7 per 1,000 map loads after free tier |

Monitor usage: **APIs & Services** → **Dashboard**

---

## Troubleshooting

### Error: "This API is not activated"
→ Enable the specific API in Cloud Console

### Error: "API key not valid"
→ Check key restrictions match your domain

### Map not loading
→ Check browser console for specific error messages

---

## Config Location

```typescript
// src/config/config.ts
maps: {
  google: {
    apiKey: 'AIzaSyD-e_4ZAS_9BzyGArjA6rsuC4y_QnwxjHs',
    services: {
      maps: true,
      places: true,
      directions: true,
      geocoding: true,
      distanceMatrix: true,
    },
    enabled: true,
  },
}
```

---

## Related Files

| File | Purpose |
|------|---------|
| `src/services/mapsService.ts` | Maps utility functions |
| `src/components/GreenTransportMap.tsx` | Map component |
| `src/pages/TransportPage.tsx` | Transport page with map |

---

## Contact

For issues with API setup, contact the Google Cloud project administrator.
